/**
 * @fileoverview This file includes the relevant frame encoders and decoders
 * 	that Minerva client needs.
 */

goog.provide('cw.net.HelloFrame');
goog.provide('cw.net.StringFrame');
goog.provide('cw.net.SeqNumFrame');
goog.provide('cw.net.SackFrame');
goog.provide('cw.net.YouCloseItFrame');
goog.provide('cw.net.PaddingFrame');
goog.provide('cw.net.ResetFrame');
goog.provide('cw.net.TransportKillFrame');
goog.provide('cw.net.InvalidFrame');
goog.provide('cw.net.decodeFrameFromServer');

goog.require('goog.debug.Error');
goog.require('goog.json');
goog.require('cw.repr');
goog.require('cw.eq');


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
 * The largest integer that can be represented in JavaScript without
 * losing integral precision.
 *
 * @private
 */
cw.net.LARGEST_INTEGER_ = Math.pow(2, 53);


/**
 * A number larger than the largest integer than can be represented
 * in JavaScript. Note: the ` + 1`ed number is not larger.
 */
cw.net.LARGER_THAN_LARGEST_INTEGER_ = cw.net.LARGEST_INTEGER_ + 2;


/**
 * Hello frame properties. Keep in sync with minerva/newlink.py
 *
 * @enum {string}
 * @private
 */
cw.net.HelloProperty_ = {
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


/**
 * HTTP format for the Minerva transport
 *
 * @enum {number}
 * @private
 */
cw.net.HttpFormat_ = {
	FORMAT_XHR: 2,
	FORMAT_HTMLFILE: 3
}


/**
 * @param {!Object.<string, *>} options
 * @constructor
 */
cw.net.HelloFrame = function(options) {
	this.options = options;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.HelloFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.HelloFrame &&
		cw.eq.equals(this.options, other.options, messages));
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.HelloFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new HelloFrame(');
	cw.repr.reprToPieces(this.options, sb);
	sb.push(')');
}

/**
 * @return {!Object.<string, *>}
 * @private
 */
cw.net.HelloFrame.prototype.makeCompactMapping_ = function() {
	var map = {};
	for(var k in this.options) {
		map[cw.net.HelloProperty_[k]] = this.options[k];
	}
	return map;
}

/**
 * @return {string} Encoded frame
 */
cw.net.HelloFrame.prototype.encode = function() {
	return goog.json.serialize(this.makeCompactMapping_()) + 'H';
}

// TODO: .decode, because we'll need to decode {HelloFrame}s in the unit tests.



/**
 * @param {string} string
 * @constructor
 */
cw.net.StringFrame = function(string) {
	this.string = string;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.StringFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.StringFrame &&
		this.string == other.string);
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.StringFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push("new StringFrame(");
	cw.repr.reprToPieces(this.string, sb);
	sb.push(")");
}

/**
 * @return {string} Encoded frame
 */
cw.net.StringFrame.prototype.encode = function() {
	return this.string + ' ';
}


/**
 * @param {string} frameString A string that ends with " ".
 * @return {!cw.net.StringFrame}
 */
cw.net.StringFrame.decode = function(frameString) {
	return new cw.net.StringFrame(frameString.substr(0, frameString.length - 1));
}



/**
 * @param {number} seqNum
 * @constructor
 */
cw.net.SeqNumFrame = function(seqNum) {
	this.seqNum = seqNum;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.SeqNumFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.SeqNumFrame &&
		this.seqNum == other.seqNum);
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.SeqNumFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new SeqNumFrame(', String(this.seqNum), ')');
}

/**
 * @return {string} Encoded frame
 */
cw.net.SeqNumFrame.prototype.encode = function() {
	return this.seqNum + 'N';
}


/**
 * @param {string} frameString A string that ends with "N".
 * @return {!cw.net.SeqNumFrame}
 */
cw.net.SeqNumFrame.decode = function(frameString) {
	// Not necessary to remove "N" before parseInt
	var seqNum = parseInt(frameString, 10);
	if(seqNum < 0 || seqNum > cw.net.LARGEST_INTEGER_ || isNaN(seqNum)) {
		throw new cw.net.InvalidFrame("bad seqNum " + seqNum);
	}
	return new cw.net.SeqNumFrame(seqNum);
}



/**
 * @param {number} ackNumber
 * @param {!Array.<number>} sackList
 * @constructor
 */
cw.net.SackFrame = function(ackNumber, sackList) {
	this.ackNumber = ackNumber;
	this.sackList = sackList;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.SackFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.SackFrame &&
		this.ackNumber == other.ackNumber &&
		cw.eq.equals(this.sackList, other.sackList, messages));
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.SackFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new SackFrame(', String(this.ackNumber), ', ');
	cw.repr.reprToPieces(this.sackList, sb);
	sb.push(')');
}

/**
 * @return {string} Encoded frame
 */
cw.net.SackFrame.prototype.encode = function() {
	return this.sackList.join(',') + '|' + this.ackNumber + 'A';
}

/**
 * @param {string} frameString A string that ends with "A".
 * @return {!cw.net.SackFrame}
 */
cw.net.SackFrame.decode = function(frameString) {
	var parts = frameString.split('|');

	if(parts.length != 2) {
		throw new cw.net.InvalidFrame("expected 1 split");
	}

	// Not necessary to remove "A" before parseInt
	var ackNumber = parseInt(parts[1], 10);

	if(ackNumber < 0 || ackNumber > cw.net.LARGEST_INTEGER_ || isNaN(ackNumber)) {
		throw new cw.net.InvalidFrame("bad ackNumber " + ackNumber);
	}

	var sackListStrs = parts[0].split(',');
	var sackList = [];
	for(var i=0, len=sackListStrs.length; i < len; i++) {
		var sackNum = sackListStrs[i];
		if(sackNum < 0 || sackNum > cw.net.LARGEST_INTEGER_ || isNaN(sackNum)) {
			throw new cw.net.InvalidFrame("bad sackNum " + sackNum);
		}
		sackList.push(parseInt(sackNum, 10));
	}

	return new cw.net.SackFrame(ackNumber, sackList);
}



/**
 * @constructor
 */
cw.net.YouCloseItFrame = function() {

}

/**
 * @param {!Array.<string>} sb
 */
cw.net.YouCloseItFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new YouCloseItFrame()');
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.YouCloseItFrame.prototype.equals = function(other, messages) {
	return (other instanceof cw.net.YouCloseItFrame);
}

/**
 * @return {string} Encoded frame
 */
cw.net.YouCloseItFrame.prototype.encode = function() {
	return 'Y';
}

/**
 * @param {string} frameString A string that ends with "Y".
 * @return {!cw.net.YouCloseItFrame}
 */
cw.net.YouCloseItFrame.decode = function(frameString) {
	if(frameString.length != 1) {
		throw new cw.net.InvalidFrame("leading garbage");
	}
	return new cw.net.YouCloseItFrame();
}



/**
 * @param {number} numBytes How many bytes of padding
 * @constructor
 */
cw.net.PaddingFrame = function(numBytes) {
	this.numBytes = numBytes;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.PaddingFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.PaddingFrame &&
		this.numBytes == other.numBytes);
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.PaddingFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new PaddingFrame(', String(this.numBytes), ')');
}

/**
 * @return {string} Encoded frame
 */
cw.net.PaddingFrame.prototype.encode = function() {
	var p = Array(this.numBytes);
	p.push('P');
	return p.join(' ');
}

/**
 * @param {string} frameString A string that ends with "P".
 * @return {!cw.net.PaddingFrame}
 */
cw.net.PaddingFrame.decode = function(frameString) {
	return new cw.net.PaddingFrame(frameString.length - 1);
}



/**
 * @param {string} reasonString
 * @return {boolean} Whether {@code reasonString} is a valid reset reason.
 * @private
 */
cw.net.isValidReasonString_ = function(reasonString) {
	// Inclusive range 0x20 through 0x7E is allowed. 
	return reasonString.length <= 255 && /^([ -~]*)$/.test(reasonString);
}


/**
 * A reset frame indicates this side has given up on the Stream.
 * A reset frame from the server implies a transport kill as well.
 *
 * @param {string} reasonString Why the Stream reset.
*	ASCII (0x20-0x7E)-only C{str}, max 255 bytes.
 * @param {boolean} applicationLevel Whether the reset was application-level
 * 	(not caused by Minerva internals).
 * @constructor
 */
cw.net.ResetFrame = function(reasonString, applicationLevel) {
	this.reasonString = reasonString;
	this.applicationLevel = applicationLevel;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.ResetFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.ResetFrame &&
		this.reasonString == other.reasonString &&
		this.applicationLevel == other.applicationLevel);
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.ResetFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push("new ResetFrame(");
	cw.repr.reprToPieces(this.reasonString, sb);
	sb.push(", ", String(this.applicationLevel), ")");
}

/**
 * @return {string} Encoded frame
 */
cw.net.ResetFrame.prototype.encode = function() {
	return this.reasonString + '|' + Number(this.applicationLevel) + '!';
}


/**
 * @param {string} frameString A string that ends with "!".
 * @return {!cw.net.ResetFrame}
 */
cw.net.ResetFrame.decode = function(frameString) {
	var reasonString = frameString.substr(0, frameString.length - 3);

	if(!cw.net.isValidReasonString_(reasonString)) {
		throw new cw.net.InvalidFrame("illegal bytes in reasonString");
	}

	// Either "|0" or "|1"
	var applicationLevelStr = frameString.substr(frameString.length - 3, 2);
	var applicationLevel = {'|0': false, '|1': false}[applicationLevelStr];
	if(applicationLevel == null) {
		throw new cw.net.InvalidFrame("bad applicationLevel");
	}

	return new cw.net.ResetFrame(reasonString, applicationLevel);
}



/**
 * Transport kill reasons. Keep in sync with minerva/newlink.py
 *
 * @enum {string}
 */
cw.net.TransportKillReason = {
	stream_attach_failure: 'stream_attach_failure',
	acked_unsent_strings: 'acked_unsent_strings',
	invalid_frame_type_or_arguments: 'invalid_frame_type_or_arguments',
	frame_corruption: 'frame_corruption'
}

/**
 * @type {!Object.<string, !cw.net.TransportKillReason>}
 *
 * @private
 */
cw.net.AllTransportKillReasons_ = {
	'stream_attach_failure': cw.net.TransportKillReason.stream_attach_failure,
	'acked_unsent_strings': cw.net.TransportKillReason.acked_unsent_strings,
	'invalid_frame_type_or_arguments': cw.net.TransportKillReason.invalid_frame_type_or_arguments,
	'frame_corruption': cw.net.TransportKillReason.frame_corruption
};


/**
 * @param {!cw.net.TransportKillReason} reason
 *
 * @constructor
 */
cw.net.TransportKillFrame = function(reason) {
	this.reason = reason;
}

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {!Array.<string>} messages
 * @return {boolean}
 */
cw.net.TransportKillFrame.prototype.equals = function(other, messages) {
	return (
		other instanceof cw.net.TransportKillFrame &&
		this.reason == other.reason);
}

/**
 * @param {!Array.<string>} sb
 */
cw.net.TransportKillFrame.prototype.__reprToPieces__ = function(sb) {
	sb.push('new TransportKillFrame(');
	cw.repr.reprToPieces(this.reason, sb);
	sb.push(')');
}

/**
 * @return {string} Encoded frame
 */
cw.net.TransportKillFrame.prototype.encode = function() {
	return this.reason + 'K';
}

/**
 * @param {string} frameString A string that ends with "K".
 * @return {!cw.net.TransportKillFrame}
 */
cw.net.TransportKillFrame.decode = function(frameString) {
	var reason = frameString.substr(0, frameString.length - 1);
	reason = cw.net.AllTransportKillReasons_[reason];
	if(reason == null) {
		throw new cw.net.InvalidFrame("unknown kill reason: " + reason);
	}

	return new cw.net.TransportKillFrame(reason);
}


/**
 * @type {(cw.net.HelloFrame|cw.net.StringFrame|cw.net.SeqNumFrame|
 * 	cw.net.SackFrame|cw.net.YouCloseItFrame|cw.net.PaddingFrame|
 * 	cw.net.ResetFrame|cw.net.TransportKillFrame)}
 */
cw.net.Frame = goog.typedef;


/**
 * Decode a frame received from a Minerva client.
 *
 * @param {string} frameString
 * @return {!cw.net.Frame} Decoded frame
 */
cw.net.decodeFrameFromClient = function(frameString) {
	if(!frameString) {
		throw new cw.net.InvalidFrame("0-length frame");
	}

	var lastByte = frameString.substr(frameString.length - 1, 1);

	// Keep this ordered by most-probable first
	if (lastByte == " ") {
		return cw.net.StringFrame.decode(frameString);
	} else if(lastByte == "A") {
		return cw.net.SackFrame.decode(frameString);
	} else if(lastByte == "N") {
		return cw.net.SeqNumFrame.decode(frameString);
	} else if(lastByte == "H") {
		return cw.net.HelloFrame.decode(frameString);
	} else if(lastByte == "!") {
		return cw.net.ResetFrame.decode(frameString);
	} else {
		throw new cw.net.InvalidFrame("Invalid frame type " + lastByte);
	}
}


/**
 * Decode a frame received from a Minerva server.
 * 
 * @param {string} frameString
 * @return {!cw.net.Frame} Decoded frame
 */
cw.net.decodeFrameFromServer = function(frameString) {
	if(!frameString) {
		throw new cw.net.InvalidFrame("0-length frame");
	}

	var lastByte = frameString.substr(frameString.length - 1, 1);

	// Keep this ordered by most-probable first
	if (lastByte == " ") {
		return cw.net.StringFrame.decode(frameString);
	} else if(lastByte == "A") {
		return cw.net.SackFrame.decode(frameString);
	} else if(lastByte == "N") {
		return cw.net.SeqNumFrame.decode(frameString);
	} else if(lastByte == "Y") {
		return cw.net.YouCloseItFrame.decode(frameString);
	} else if(lastByte == "P") {
		return cw.net.PaddingFrame.decode(frameString);
	} else if(lastByte == "!") {
		return cw.net.ResetFrame.decode(frameString);
	} else if(lastByte == "K") {
		return cw.net.TransportKillFrame.decode(frameString);
	} else {
		throw new cw.net.InvalidFrame("Invalid frame type " + lastByte);
	}
}