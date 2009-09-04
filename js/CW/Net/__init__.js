// import CW
// import CW.Defer

CW.Error.subclass(CW.Net, 'ParseError');

// TODO: have some obfu-vars

/**
 * This parser solves two problems:
 *
 *    - decoding a series of bencode strings from an object with a L{responseText}
 *          that may grow.
 *
 *    - accessing the object's C{responseText} only when necessary to avoid memory-
 *          copying and excessive CPU use in some browsers (Firefox, maybe others).
 *          (This optimization is optional; see L{getNewFrames} docstring)
 *
 * In Firefox, accessing an XHR object's C{responseText} or C{responseText.length}
 * repeatedly may cause it to copy all the data in memory, temporarily causing ~50-80MB
 * memory spikes.
 *
 * This decoder must be manually "pushed" by calling L{getNewFrames}.
 *
 * L{xObject.responseText} is assumed to have unicode/byte equivalence.
 * Non-ASCII characters are forbidden, because of our optimizations,
 * and because of browser bugs related to XHR readyState 3.
 */
CW.Class.subclass(CW.Net, "ResponseTextDecoder").methods(
	/**
	 * L{xObject} is an L{XMLHttpRequest} or L{XDomainRequest} object
	 * or any object with a C{responseText} property (a string).
	 *
	 * L{MAX_LENGTH} is the maximum length of frame to parse (in characters).
	 */
	function __init__(self, xObject, MAX_LENGTH) {
		self._offset = 0;
		// Need to have at least 1 byte before doing any parsing
		self._ignoreUntil = 1;
		// Optimization: this acts as both a mode and a readLength
		self._modeOrReadLength = 0; // 0 means mode LENGTH, >= 1 means mode DATA
		self.xObject = xObject;
		if(!MAX_LENGTH) {
			MAX_LENGTH = 1024*1024*1024;
		}
		self.setMaxLength(MAX_LENGTH);
	},

	/**
	 * Set maximum frame length to L{MAX_LENGTH}.
	 */
	function setMaxLength(self, MAX_LENGTH) {
		self.MAX_LENGTH = MAX_LENGTH;
		self.MAX_LENGTH_LEN = (''+MAX_LENGTH).length;
	},

	/**
	 * Check for new data in L{xObject.responseText} and return an array of new frames.
	 *
	 * If you know how many bytes are available in L{responseText} through a side-channel
	 * like an onprogress event, pass a number L{responseTextLength}. Passing a too-low
	 * L{responseTextLength} is safe, but will obviously fail to find some data. Pass C{null}
	 * for L{responseTextLength} if you do not know how many bytes are in L{responseText}.
	 * See this class' docstring for rationale.
	 *
	 * L{CW.Net.ParseError} will be thrown if:
	 *    - a frame with size greater than L{MAX_LENGTH} is found
	 *    - if a corrupt length value is found (though the throwing may be delayed for a few bytes).
	 */
	function getNewFrames(self, responseTextLength) {
		if(responseTextLength !== null && responseTextLength < self._ignoreUntil) {
			// There certainly isn't enough data in L{responseText} yet, so return.
			return [];
		}

		var text = self.xObject.responseText;
		if(responseTextLength === null) {
			responseTextLength = text.length;
		}
		var strings = [];
		for(;;) {
			if(self._modeOrReadLength === 0) { // mode LENGTH
				var colon = text.indexOf(':', self._offset);
				if(colon === -1) {
					if(responseTextLength - self._offset > self.MAX_LENGTH_LEN) {
						throw new CW.Net.ParseError("length too long");
					}
					////console.log('No colon yet. Break.')
					break;
					// Unlike minerva._protocols, don't eager-fail if there are
					// non-digits; it's a waste of CPU time. We'll only be collecting
					// possibly-non-digits for MAX_LENGTH_LEN bytes.
				}

				var extractedLengthStr = text.substr(self._offset, colon-self._offset);
				// Accept only positive integers with no leading zero.
				// TODO: maybe disable this check for long-time user agents with no problems
				if(!/^[1-9]\d*$/.test(extractedLengthStr)) {
					throw new CW.Net.ParseError("corrupt length: " + extractedLengthStr);
				}
				// TODO: check if `+extractedLengthStr' is faster; use it if it is.
				var readLength = parseInt(extractedLengthStr, 10);
				if(readLength > self.MAX_LENGTH) {
					throw new CW.Net.ParseError("length too long: " + readLength);
				}
				self._modeOrReadLength = readLength;
				self._offset += (''+readLength).length + 1; // + 1 to skip over the ":"
			} else { // mode DATA
				if(self._offset + self._modeOrReadLength > responseTextLength) {
					////console.log('Not enough data bytes yet. Break.');
					break;
				}
				var s = text.substr(self._offset, self._modeOrReadLength);
				self._offset += self._modeOrReadLength;
				self._modeOrReadLength = 0;
				strings.push(s);
			}
		}
		if(self._modeOrReadLength === 0) {
			// Can't ignore anything when still receiving the length
			self._ignoreUntil = responseTextLength + 1;
		} else {
			self._ignoreUntil = self._offset + self._modeOrReadLength;
		}
		////console.log('_ignoreUntil now', self._ignoreUntil);
		return strings;
	}
);


// IWindowTime is an object with methods setTimeout, clearTimeout, setInterval, clearInterval


// Stream

/**
 * There's no "sendBoxEventually" here - if you want that, maintain your own
 * "send eventually" queue and use L{gotSendingOpportunity} to send
 * the "send eventually" boxes. You might also want to send them on a timer
 * because some transports will never have a "special sending opportunity"
 * after they connect.
 */

// TODO: there might be some crazy way to optimize the queue - maybe just use an object instead of an array?

// We use sequence numbers for both transport-level reliability and for
// message-level reliability. This isn't a problem because we never need
// to non-box frames between consequentive boxes in a queue (either server
// side or client side.) Non-box frames are at the beginning of a stream or inserted
// safely into the queue.

CW.Error.subclass(CW.Net, 'StreamTimedOut');
CW.Error.subclass(CW.Net, 'SeqNumTooHighError');

CW.Class.subclass(CW.Net, "Stream").methods(
	/**
	 * Initialize Stream with:
	 *    L{window}, provides L{IWindowTime}
	 *    L{timeout}, Stream timeout in milliseconds.
	 */
	function __init__(self, window, timeout) {
		self._window = window;
		self._timeout = timeout ? timeout : 30000;
		self._queue = [];
		self._seqNumAt0 = 0;
		self._ackS2C = -1;
		self._notifications = {};
	},

	// TODO: errback all the notifications when the stream times out

	function _getLastQueueSeq(self) {
		return self._seqNumAt0 + self._queue.length;
	},

	/**
	 * Enqueue boxes L{boxes} for sending soon. Returns the C2S sequence number
	 * of the _last_ box, in case you need delivery notification later.
	 *
	 * Whenever possible, use L{sendBoxes} to send multiple boxes instead
	 * of repeated calls to L{sendBox}.
	 *
	 * It is often correct to buffer boxes in a list and give them to
	 * L{sendBoxes} all at once.
	 */
	function sendBoxes(self, boxes) {
		var boxesLen = boxes.length;
		for(var i=0; i < boxesLen; i++) {
			self._queue.push(box);
		}
		var seqNum = self._getLastQueueSeq();
		self._sendIfPossible();
		return seqNum;
	},

	/**
	 * Enqueue box L{box} for sending soon. Returns the C2S sequence number
	 * of the box, in case you need delivery notification later.
	 *
	 * Use L{sendBoxes} instead if you are sending multiple boxes.
	 */
	function sendBox(self, box) {
		self._queue.push(box);
		var seqNum = self._getLastQueueSeq();
		self._sendIfPossible();
		return seqNum;
	},

	function _sendIfPossible(self) {
		/*
		This will be pretty complicated.
		We want to:
			use a dual S2C-C2S transport if we have one connected, or expect one to connect

			when possible, allow smuggling C2S into an S2C HTTP request
			(don't create the C2S request immediately?)

			

		 */

	},

	/**
	 * Given box represented by L{seqNum}, return a Deferred that triggers with
	 * callback if delivery was successful, or errback if not successful.
	 */
	function notifyDelivery(self, seqNum) {
		// There's probably a pathological case here
		if(seqNum > self._getLastQueueSeq()) {
			throw new Error("seqNum too high, we never even sent this");
		}
		self._notifications.push([seqNum, CW.Defer.Deferred()]);
		self._notifications.sort()
		//self._notifications.sort(function(a, b){a[0] < b[0] ? -1 : 1}); // not necessary
	},

	/**
	 * Server received all frames before L{seqNum}.
	 */
	function serverReceivedEverythingBefore(self, seqNum) {
		// Remove old boxes from the queue
		var lastSeq = self._getLastQueueSeq();
		if(seqNum > lastSeq) {
			throw new CW.Net.SeqNumTooHighError("not true: " + seqNum + " > " + lastSeq);
		}
		self._queue.splice(0, seqNum - self._seqNumAt0);
		self._seqNumAt0 = seqNum;

		// Trigger notifications (callback)
		var notifs = self._notifications;
		var notificationsLen = notifs.length;
		var toRemove = 0;
		for(var i=0; i < notificationsLen; i++) {
			var oneNotif = notifs[i];
			if(oneNotif[0] < seqNum) {
				try {
					oneNotif[1].callback(null);
				} catch(e) {
					CW.err(e, 'Triggering callback '+oneNotif[1]+' for box #'+oneNotif[0]+' threw error');
				}
				toRemove += 1;
			}
		}
		notifs.splice(0, toRemove);
	},

	/**
	 * Internal function; called when Stream timeout is triggered.
	 */
	function _killStream(self) {
		// Trigger notifications (errback)
		var notifs = self._notifications;
		var notificationsLen = notifs.length;
		for(var i=0; i < notificationsLen; i++) {
			var oneNotif = notifs[i];
			try {
				oneNotif[1].errback(new CW.Net.StreamTimedOut());
			} catch(e) {
				CW.err(e, 'Triggering errback '+oneNotif[1]+' for box #'+oneNotif[0]+' threw error');
			}
		}
		self._notifications = [];
		self.streamEnded(); // call user-customizable method
	},

	/**
	 * Change the timeout to L{timeout} milliseconds.
	 */
	function changeTimeout(self, timeout) {
		self._timeout = timeout;
		// XXX do we need to do anything else here?
	},

	/**
	 * L{gotSendingOpportunity} is called when CW.Net is about to initialize a
	 * new S2C transport. You can use this event to send just-created or specially-queued
	 * boxes along with the new S2C transport. If CW.Net is about to initialize an HTTP
	 * S2C transport, boxes queued right now might avoid a C2S HTTP request.
	 * For non-HTTP transports, queuing a box right now might avoid having to send
	 * two separate TCP packets.
	 *
	 * You're free to call L{sendBox} or L{sendBoxes} as usual. Note that smuggling
	 * will not always work, but boxes will still be delivered.
	 *
	 * Some S2C transports can stay open for a very long time
	 * (FSTransport, WSTransport) and therefore L{gotSendingOpportunity}
	 * might only be called once.
	 *
	 * Override this.
	 */
	function gotSendingOpportunity(self) {
		// XXX
	},


	/**
	 * Something important changed about how frequently we can send/receive
	 * over the Stream. This is probably because the transport was upgraded
	 * or downgraded.
	 *
	 * Override this.
	 */
	function streamQualityChanged(self, qualityInfo) {

	},


	/**
	 * Stream timed out. Override this.
	 */
	function streamEnded(self) {
		// XXX
	},


	/**
	 * Received box L{boxes}. Override this.
	 */
	function boxesReceived(self, boxes) {
		CW.msg('Forgot to override boxesReceived?');
	}
)



// The reason we want a StreamFactory is so that the building of Streams can be
// controlled; an application may want to pass a reference to another object into
// a Stream.

// StreamFactory
	// buildStream
CW.Class.subclass(CW.Net, "StreamFactory").methods(
	/**
	 * This takes L{window} as an argument so that unit tests
	 * can pass in a dummy window with deterministic timer features.
	 */
	function __init__(self, window) {
		self._window = window;
	},

	function buildStream(self) {
		throw new Error("override this");
	}
)


// Connector
// maybe this should be reactor?
// We probably want to be able to build a 'Clock' that can be moved forward
// but alternatively we could pass in a fake 'window' to classes that are using setTimeout and so on


//XHRTransport
//XDRTransport
//SSETransport
//ScriptTransport
//WSTransport
//FSTransport
