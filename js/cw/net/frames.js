/**
 * @fileoverview This file includes the relevant frame encoders and decoders
 * 	that Minerva client needs.
 */

goog.provide('cw.net.HelloProperty');
goog.provide('cw.net.HelloFrame');
goog.provide('cw.net.StringFrame');
goog.provide('cw.net.SeqNumFrame');
goog.provide('cw.net.SackFrame');
goog.provide('cw.net.YouCloseItFrame');
goog.provide('cw.net.PaddingFrame');
goog.provide('cw.net.ResetFrame');
goog.provide('cw.net.TransportKillFrame');
goog.provide('cw.net.InvalidFrame');
goog.provide('cw.net.HelloProperty');
goog.provide('cw.net.decodeFrameFromServer');

goog.require('goog.debug.Error');
goog.require('goog.json');


/**
 * This is thrown when an encoded frame cannot be decoded.
 * @param {string} msg Reason why parse failed
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.InvalidFrame = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.InvalidFrame, goog.debug.Error);
cw.net.InvalidFrame.prototype.name = 'cw.net.InvalidFrame';


/**
 * @private
 */
cw.net.LARGEST_INTEGER_ = Math.pow(2, 53);


/**
 * Hello frame properties. Keep in sync with minerva/newlink.py
 *
 * @enum {string}
 */
cw.net.HelloProperty = {
	transportNumber: 'tnum',
	protocolVersion: 'ver',
	httpFormat: 'format',
	requestNewStream: 'new',
	streamId: 'id',
	credentialsData: 'cred',
	streamingResponse: 'ming',
	needPaddingBytes: 'pad',
	maxReceiveBytes: 'maxb',
	maxOpenTime: 'maxt',
	useMyTcpAcks: 'tcpack',
	succeedsTransport: 'eeds'
}



FORMAT_XHR, FORMAT_HTMLFILE = 2, 3


/**
 * @param {!Object.<string, *>} options
 *
 * @constructor
 */
cw.net.HelloFrame = function(options) {
	this.options = options;
}

//	def __eq__(self, other):
//		return False if type(self) != type(other) else self.__dict__ == other.__dict__
//
//
//	def __ne__(self, other):
//		return True if type(self) != type(other) else self.__dict__ != other.__dict__


cw.net.HelloFrame.prototype.toString = function() {
	return 'HelloFrame(' + goog.json.serialize(this.options) + ')';
}

/**
 * @private
 */
cw.net.HelloFrame.prototype.makeCompactMapping_() {
	var map = {};
	for(var k in this.options) {
		map[cw.net.HelloProperty[k]] = this.options[k];
	}
	return map;
}


cw.net.HelloFrame.prototype.encode = function() {
	return goog.json.serialize(this.makeCompactMapping_()) + 'H';
}



/**
 * @param {string} string
 *
 * @constructor
 */
cw.net.StringFrame = function(string) {
	this.string = string;
}


cw.net.StringFrame.prototype.toString = function() {
	return "StringFrame(" + this.string.replace("'", "\\'") + "')";
}


cw.net.StringFrame.prototype.encode = function() {
	return self.string + ' ';
}


/**
 * @param {string} frameString A string that ends with " ".
 */
cw.net.StringFrame.decode = function(frameString) {
	return new cw.net.StringFrame(frameString.substr(0, frameString.length - 1));
}



/**
 * @param {number} seqNum
 *
 * @constructor
 */
cw.net.SeqNumFrame = function(seqNum) {
	this.seqNum = seqNum;
}


cw.net.SeqNumFrame.prototype.toString = function() {
	return 'SeqNumFrame(' + this.seqNum + ')';
}


cw.net.SeqNumFrame.prototype.encode = function() {
	return this.seqNum + 'N';
}


/**
 * @param {string} frameString A string that ends with "N".
 */
cw.net.SeqNumFrame.decode = function(frameString) {
	// Not necessary to remove "N" before parseInt, but there may be
	// buggy JavaScript implementations out there.
	var withoutN = frameString.substr(0, frameString.length - 1);
	var seqNum = parseInt(withoutN, 10);
	if(seqNum < 0 || seqNum > cw.net.LARGEST_INTEGER_) {
		throw new InvalidFrame("bad seqNum " + seqNum);
	}
	return new cw.net.SeqNumFrame(seqNum);
}



/**
 * @param {number} ackNumber
 * @param {!Array.<number>} sackList
 *
 * @constructor
 */
cw.net.SackFrame = function(ackNumber, sackList) {
	this.ackNumber = ackNumber;
	this.sackList = sackList;
}


cw.net.SackFrame.prototype.toString = function() {
	return 'SackFrame(' + this.ackNumber + ', [' + this.sackList.join(',') + '])';
}


cw.net.SackFrame.prototype.encode = function() {
	return this.sackList.join(',') + '|' + this.ackNumber + 'A';
}

/**
 * @param {string} frameString A string that ends with "A".
 */
cw.net.SackFrame.decode = function(frameString):
		joinedSackList, ackNumberStr = str(frameString[:-1]).rsplit('|', 1)
		try:
			sackList = tuple(strToNonNegLimit(s, 2**53) for s in joinedSackList.split(',')) if joinedSackList else ()
			ackNumber = strToNonNegLimit(ackNumberStr, 2**53)
		except ValueError:
			raise InvalidFrame("bad sackList or ackNumber")
		return new cw.net.SackFrame(ackNumber, sackList);
}



/**
 * No arguments.
 *
 * @constructor
 */
cw.net.YouCloseItFrame = function() {

}


cw.net.YouCloseItFrame.prototype.toString = function() {
	return 'YouCloseItFrame()';
}


cw.net.YouCloseItFrame.prototype.encode = function() {
	return 'Y';
}

	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "Y".
		"""
		if len(frameString) != 1:
			raise InvalidFrame("leading garbage")
		return cls()




/**
 * @param {number} numBytes How many bytes of padding
 *
 * @constructor
 */
cw.net.PaddingFrame = function(numBytes) {
	this.numBytes = numBytes;
}


PaddingFrame.prototype.toString = function() {
	return 'PaddingFrame(' + this.numBytes + ')';
}


PaddingFrame.prototype.encode = function() {
	var p = Array(this.numBytes + 1);
	p.push('P');
	return p.join(' ');
}

	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "P".
		"""
		return cls(len(frameString) - 1)



/**
 * @param {string} reasonString
 * @return {bool} Whether {@code reasonString} is a valid reset reason.
 */
cw.net.isValidReasonString = function(reasonString) {
	// Inclusive range 0x20 through 0x7E is allowed. 
	return reasonString.length <= 255 && /^([ -~]*)$/.test(reasonString);
}


/**
 * A reset frame indicates this side has given up on the Stream.
 * A reset frame from the server implies a transport kill as well.
 *
 * @param {string} reasonString Why the Stream reset.
*	ASCII (0x20-0x7E)-only C{str}, max 255 bytes.
 *
 * @param {bool} applicationLevel Whether the reset was application-level
 * 	(not caused by Minerva internals).
 *
 * @constructor
 */
cw.net.ResetFrame = function(reasonString, applicationLevel) {
	this.reasonString = reasonString;
	this.applicationLevel = applicationLevel;
}


cw.net.ResetFrame.prototype.toString = function() {
		return 'ResetFrame(%r, %r)' % (self.__class__.__name__, self[1], self[2])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "!".
		"""
		reasonString, applicationLevelStr = str(frameString[:-1]).split('|')
		try:
			applicationLevel = {'0': False, '1': True}[applicationLevelStr]
		except KeyError:
			raise InvalidFrame("bad applicationLevel")
		if not isValidReasonString(reasonString):
			raise InvalidFrame("illegal bytes in reasonString")

		return cls(reasonString, applicationLevel)


cw.net.ResetFrame.prototype.encode = function() {
		return self.reasonString + '|' + str(int(self.applicationLevel)) + '!'



class _TransportKillReason(Constant):
	__slots__ = ()



cw.net.TransportKillFrame = function() {
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	reason = property(operator.itemgetter(1))

	# Either because no such Stream, or bad credentialsData
	stream_attach_failure = _TransportKillReason("stream_attach_failure")

	# Peer acked strings that we never sent
	acked_unsent_strings = _TransportKillReason("acked_unsent_strings")

	# Peer sent frames that we don't understand
	invalid_frame_type_or_arguments = _TransportKillReason("invalid_frame_type_or_arguments")

	# Peer sent data that could not even be decoded to frames
	# (only applies to some decoders).
	frame_corruption = _TransportKillReason("frame_corruption")

	allReasons = (
		stream_attach_failure, acked_unsent_strings,
		 invalid_frame_type_or_arguments, frame_corruption)

	stringToConstant = {}
	constantToString = {}
	for _c in allReasons:
		stringToConstant[_c.value] = _c
		constantToString[_c] = _c.value
	del _c


	def __new__(cls, reason):
		"""
		C{reason} is a one of the L{_TransportKillReason}s defined on
		this class.
		"""
		return tuple.__new__(cls, (cls._MARKER, reason))


cw.net.TransportKillFrame.prototype.toString = function() {
		return '%s(%r)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "K".
		"""
		string = str(frameString[:-1])
		try:
			reason = cls.stringToConstant[string]
		except KeyError:
			raise InvalidFrame("unknown kill reason %r" % string)

		return cls(reason)


cw.net.TransportKillFrame.prototype.encode = function() {
		return self.constantToString[self.reason] + 'K'



/**
 * @type {(HelloFrame|StringFrame|SeqNumFrame|SackFrame|YouCloseItFrame|PaddingFrame|ResetFrame|TransportKillFrame)}
 */
cw.net.Frame = goog.typedef;


/**
 * Decode a frame received from a Minerva server.
 * 
 * @param {string} frameString
 * @return {!cw.net.Frame} Decoded frame
 */
cw.net.decodeFrameFromServer = function(frameString) {
	if(!frameString) {
		throw new InvalidFrame("0-length frame");
	}

	var lastByte = frameString.substr(frameString.length - 1, 1);

	// Keep this ordered by most-probable first
	if (lastByte == " ") {
		return StringFrame.decode(frameString);
	} else if(lastByte == "A") {
		return SackFrame.decode(frameString);
	} else if(lastByte == "N") {
		return SeqNumFrame.decode(frameString);
	} else if(lastByte == "Y") {
		return YouCloseItFrame.decode(frameString);
	} else if(lastByte == "P") {
		return PaddingFrame.decode(frameString);
	} else if(lastByte == "!") {
		return ResetFrame.decode(frameString);
	} else if(lastByte == "K") {
		return TransportKillFrame.decode(frameString);
	} else {
		throw new InvalidFrame("Invalid frame type " + lastByte);
	}
}
