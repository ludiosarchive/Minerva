// import CW

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


// Stream
CW.Class.subclass(CW.Net, "Stream").methods(

	function __init__(self, window) {
		self._window = window;
		self._queue = [];
		self._eventually = [];
	},

	/*
	Enqueue boxes L{boxes} for sending soon.

	Whenever possible, use L{sendBoxes} to send multiple boxes instead
	of repeated calls to L{sendBox}.

	It is often correct to buffer boxes in a list and give them to
	L{sendBoxes} all at once. */
	function sendBoxes(self, boxes) {
		// XXX
		self._sendIfPossible()
	},

	/*
	Enqueue box L{box} for sending soon. Use L{sendBoxes} instead
	if you are sending multiple boxes.
	*/
	function sendBox(self, box) {
		// XXX
		self._sendIfPossible()
	},

	/*
	Enqueue box L{box} for sending when most convenient for CW.Net.
	If using an HTTP transport, this could take about a minute.

	This may be useful for sending non-critical information collected by
	other JavaScript code.
	*/
	function sendBoxEventually(self, box) {
		// XXX
		// XXX self._eventually
	},


	/**
	 * CW.Net is about to initialize a new S2C transport. You can use this
	 * event to generate boxes to send along with an HTTP request (to avoid
	 * making a C2S HTTP request), or send along with the TCP/IP packet
	 * (to possibly avoid sending multiple packets).
	 *
	 * From inside this method, you can call either L{sendBox} or
	 * L{sendBoxEventually} to send boxes. XXX TODO REALLY no difference?
	 * XXX what about if the box user wants to send is too big to smuggle?
	 *
	 * Please note that some S2C transports may stay open for a very long time
	 * (FSTransport, WSTransport) and therefore L{gotSendingOpportunity}
	 * might only be called once.
	 */
	function gotSendingOpportunity(self) {
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
