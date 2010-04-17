
// Stream

/**
 * There's no "sendBoxEventually" here - if you want that, maintain your own
 * "send eventually" queue and use L{gotSendingOpportunity} to send
 * the "send eventually" boxes. You might also want to send them on a timer
 * because some transports will never have a "special sending opportunity"
 * after they connect.
 */

// TODO: another data structure for the queue might increase real-world performance;
// consider trying a deque (linked list).

//CW.Error.subclass(cw.net, 'StreamTimedOut');
//CW.Error.subclass(cw.net, 'SeqNumTooHighError');

cw.Class.subclass(cw.net, "Stream").methods(
	/**
	 * Initialize Stream with:
	 *    L{window}, provides L{IWindowTime}
	 *    L{timeout}, Stream timeout in milliseconds.
	 */
	function __init__(self, window, streamId, timeout) {
		self._window = window;
		self.streamId = streamId;
		self._timeout = timeout ? timeout : 30000;
		self._queue = [];
		self._seqNumAt0 = 0;
		self._ackS2C = -1;
	},

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
		self._sendIfPossible();
	},

	/**
	 * Enqueue box L{box} for sending soon. Returns the C2S sequence number
	 * of the box, in case you need delivery notification later.
	 *
	 * Use L{sendBoxes} instead if you are sending multiple boxes.
	 */
	function sendBox(self, box) {
		self._queue.push(box);
		self._sendIfPossible();
	},

	function _sendIfPossible(self) {
		/*
		This will be pretty complicated.
		We want to:
			use a dual S2C-C2S transport (Flash, WebSocket) if we have one connected, or expect one to connect

			when possible, allow smuggling C2S into an S2C HTTP request
			(don't create the C2S request immediately?)

		 */
	},


	/**
	 * Server received all frames before L{seqNum}.
	 */
	function serverReceivedEverythingBefore(self, seqNum) {
		// Remove old boxes from our C2S queue
		var lastSeq = self._getLastQueueSeq();
		if(seqNum > lastSeq) {
			//throw new cw.net.SeqNumTooHighError("(seqNum) " + seqNum + " > " + lastSeq + " (lastSeq)");
			throw new Error("(seqNum) " + seqNum + " > " + lastSeq + " (lastSeq)");
		}
		self._queue.splice(0, seqNum - self._seqNumAt0);
		self._seqNumAt0 = seqNum;
	},

	/**
	 * Internal function; called when Stream timeout is triggered.
	 */
	function _killStream(self) {
		self.streamEnded(); // call user-customizable method
	},

	/**
	 * Change the timeout to L{timeout} milliseconds.
	 */
	function changeTimeout(self, timeout) {
		self._timeout = timeout;
		// XXX do we need to do anything else here?
	},

	// TODO: this is really lame, probably just allow the registration of a pull producer for
	// these "sending opportunities".
	/**
	 * L{gotSendingOpportunity} is called when cw.net is about to initialize a
	 * new S2C transport. You can use this event to send just-created or specially-queued
	 * boxes along with the new S2C transport. If cw.net is about to initialize an HTTP
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
		// TODO: use goog.abstractMethod instead
		throw new Error('Forgot to override boxesReceived?');
	}
)



// The reason we want a StreamFactory is so that the building of Streams can be
// controlled; an application may want to pass a reference to another object into
// a Stream.

// StreamFactory
	// buildStream
cw.Class.subclass(cw.net, "StreamFactory").methods(
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


//XHRTransport
//no? XDRTransport
//SSETransport
//ScriptTransport
//WSTransport
//FSTransport
