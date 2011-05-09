/**
 * @fileoverview This file includes the relevant frame encoders and decoders
 * 	that Minerva client needs.
 */

goog.provide('cw.net.Frame');
goog.provide('cw.net.TransportKillReason');
goog.provide('cw.net.HelloFrame');
goog.provide('cw.net.StringFrame');
goog.provide('cw.net.SeqNumFrame');
goog.provide('cw.net.SackFrame');
goog.provide('cw.net.StreamStatusFrame');
goog.provide('cw.net.StreamCreatedFrame');
goog.provide('cw.net.YouCloseItFrame');
goog.provide('cw.net.CommentFrame');
goog.provide('cw.net.ResetFrame');
goog.provide('cw.net.TransportKillFrame');
goog.provide('cw.net.InvalidFrame');
goog.provide('cw.net.HttpFormat');
goog.provide('cw.net.decodeFrameFromClient');
goog.provide('cw.net.decodeFrameFromServer');

goog.require('goog.debug.Error');
goog.require('goog.json');
goog.require('goog.structs.Map');
goog.require('goog.string');
goog.require('goog.debug');
goog.require('goog.array');
goog.require('cw.checktype');
goog.require('cw.string');
goog.require('cw.repr');
goog.require('cw.math');
goog.require('cw.eq');
goog.require('cw.net.SACK');


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
 * This is thrown when an encoded hello frame cannot be decoded.
 * @param {string} msg Reason why parse failed
 * @constructor
 * @extends {cw.net.InvalidFrame}
 */
cw.net.InvalidHello = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.InvalidHello, cw.net.InvalidFrame);
cw.net.InvalidHello.prototype.name = 'cw.net.InvalidHello';


/**
 * Hello frame properties. Keep in sync with minerva/newlink.py
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
	maxInactivity: 'maxia',
	useMyTcpAcks: 'tcpack',
	succeedsTransport: 'eeds',
	sack: 'sack',
	lastSackSeenByClient: 'seenack'
};


/**
 * HTTP format for the Minerva transport
 * @enum {number}
 */
cw.net.HttpFormat = {
	FORMAT_XHR: 2,
	FORMAT_HTMLFILE: 3
};


/**
 * @private
 */
cw.net.AllHttpFormats_ = [
	cw.net.HttpFormat.FORMAT_XHR,
	cw.net.HttpFormat.FORMAT_HTMLFILE
];


/**
 * @private
 */
cw.net.ensureNonNegIntegralInt_ = function(value) {
	return cw.checktype.ensureIntInRange(value, 0, cw.math.LARGEST_INTEGER);
};


/**
 * Convert arbitrary JSON-decoded blob of objects into a
 * {@code cw.net.HelloFrame}. Throws {@code cw.net.InvalidHello}
 * if there were errors in the blob of objects.
 *
 * This was translated from the Python code
 * {@code minerva.frames.helloDataToHelloFrame}. Major changes are:
 * 	- use of ensureIntInRange instead of ensureNonNegIntLimit
 *	- JavaScript conveniently returns undefined for missing properties, so
 * 	  we pass those through to ensure...()
 *   - We avoid `value = ensureIntInRange(value)` because unlike in Python,
 * 	  all numbers are floats anyway. In the Python code we were concerned
 *     about converting floats to ints/longs.
 *
 * @param {!goog.structs.Map} helloData a Map of a blob of objects
 * @return {!cw.net.HelloFrame}
 */
cw.net.helloDataToHelloFrame_ = function(helloData) {
	var HP = cw.net.HelloProperty_;
	var MISSING_ = {};

	var obj = new cw.net.HelloFrame();

	// credentialsData is always optional.
	var credentialsData = helloData.get(HP.credentialsData, "");
	if(!(goog.isString(credentialsData)) ||
	credentialsData.length > 255 ||
	!cw.net.isRestrictedString_(credentialsData)) {
		throw new cw.net.InvalidHello("bad credentialsData");
	}
	obj.credentialsData = /** @type {string} */ (credentialsData);

	// sack is always optional.
	var sack = helloData.get(HP.sack, MISSING_);
	if(sack != MISSING_) {
		if(!goog.isString(sack)) {
			throw new cw.net.InvalidHello("sack not a string");
		}
		sack = cw.net.sackStringToSack_(sack);
		if(sack == null) {
			throw new cw.net.InvalidHello("bad sack");
		}
		obj.sack = sack;
	} else {
		obj.sack = null;
	}

	var lastSackSeen = helloData.get(HP.lastSackSeenByClient, MISSING_);
	if(lastSackSeen == MISSING_ || !goog.isString(lastSackSeen)) {
		throw new cw.net.InvalidHello("lastSackSeenByClient missing or not a string");
	}
	lastSackSeen = cw.net.sackStringToSack_(lastSackSeen);
	if(lastSackSeen == null) {
		throw new cw.net.InvalidHello("bad lastSackSeenByClient");
	}
	obj.lastSackSeenByClient = lastSackSeen;

	// requestNewStream is always optional. If missing or False/0, transport
	// is intended to attach to an existing stream.
	var requestNewStream = cw.checktype.ensureBool(helloData.get(HP.requestNewStream, false));
	if(requestNewStream == null) {
		throw new cw.net.InvalidHello("bad requestNewStream");
	}
	obj.requestNewStream = requestNewStream;

	var transportNumber = cw.net.ensureNonNegIntegralInt_(
		helloData.get(HP.transportNumber));
	if(transportNumber == null) {
		throw new cw.net.InvalidHello("bad transportNumber");
	}
	obj.transportNumber = transportNumber;

	var protocolVersion = helloData.get(HP.protocolVersion);
	if(protocolVersion !== 2) {
		throw new cw.net.InvalidHello("bad protocolVersion");
	}
	obj.protocolVersion = protocolVersion;

	var streamingResponse = cw.checktype.ensureBool(
		helloData.get(HP.streamingResponse));
	if(streamingResponse == null) {
		throw new cw.net.InvalidHello("bad streamingResponse");
	}
	obj.streamingResponse = streamingResponse;

	// Rules for streamId: must be 20-30 inclusive bytes, must not
	// contain codepoints > 127
	var streamId = helloData.get(HP.streamId);
	// In Python Minerva, instead of the \x00-\x7F check, we just
	// check that simplejson gave us a `str` instead of a `unicode`.
	if(!goog.isString(streamId) || !/^([\x00-\x7F]{20,30})$/.test(streamId)) {
		throw new cw.net.InvalidHello("bad streamId");
	}
	obj.streamId = streamId;

	// succeedsTransport is always optional. If missing, the client does not
	// want to get S2C strings over this transport. If null, the client does,
	// but the transport does not succeed an existing primary transport. If a
	// number, the transport might succeed an existing primary transport.
	var eeds = helloData.get(HP.succeedsTransport, MISSING_);
	if(eeds != MISSING_) {
		// If not exactly null, it must be a non-negative integral number.
		if(eeds !== null) {
			if(cw.net.ensureNonNegIntegralInt_(eeds) == null) {
				throw new cw.net.InvalidHello("bad succeedsTransport");
			}
		}
		obj.succeedsTransport = /** @type {?number} */ (eeds);
	}

	var httpFormat = helloData.get(HP.httpFormat, MISSING_);
	if(httpFormat != MISSING_) {
		if(!goog.array.contains(cw.net.AllHttpFormats_, httpFormat)) {
			throw new cw.net.InvalidHello("bad httpFormat");
		}
		obj.httpFormat = /** @type {cw.net.HttpFormat} */ (httpFormat);
	} else {
		obj.httpFormat = null;
	}

	// needPaddingBytes is always optional.  If missing, 0.
	var needPaddingBytes = cw.checktype.ensureIntInRange(
		helloData.get(HP.needPaddingBytes, 0), 0, 16*1024);
	if(needPaddingBytes == null) {
		throw new cw.net.InvalidHello("bad needPaddingBytes");
	}
	obj.needPaddingBytes = needPaddingBytes;

	// maxReceiveBytes is optional.  If missing, no limit.
	var maxReceiveBytes = cw.net.ensureNonNegIntegralInt_(
		helloData.get(HP.maxReceiveBytes, cw.math.LARGEST_INTEGER));
	if(maxReceiveBytes == null) {
		throw new cw.net.InvalidHello("bad maxReceiveBytes");
	}
	obj.maxReceiveBytes = maxReceiveBytes;

	// maxOpenTime is optional.  If missing, no limit.
	// Time is in seconds.
	var maxOpenTime = helloData.get(HP.maxOpenTime, MISSING_);
	if(maxOpenTime != MISSING_) {
		obj.maxOpenTime = cw.net.ensureNonNegIntegralInt_(maxOpenTime);
		if(obj.maxOpenTime == null) {
			throw new cw.net.InvalidHello("bad maxOpenTime");
		}
	} else {
		obj.maxOpenTime = null;
	}

	// maxInactivity is required.  If 0, no heartbeat.
	// Time is in seconds.
	var maxInactivity = cw.checktype.ensureIntInRange(
		helloData.get(HP.maxInactivity, -1), 0, 600);
	if(maxInactivity == null) {
		throw new cw.net.InvalidHello("bad maxInactivity");
	}
	obj.maxInactivity = maxInactivity;

	return obj;
};


/**
 * @this {cw.net.Frame}
 * @return {string} The encoded frame
 */
cw.net.frameEncodeMethod_ = function() {
	var sb = [];
	this.encodeToPieces(sb);
	return sb.join('');
};


/**
 * We do nothing in this constructor. Caller is responsible for setting
 * the correct properties.
 * @constructor
 */
cw.net.HelloFrame = function() {
	/** @type {number} */
	this.transportNumber;
	/** @type {number} */
	this.protocolVersion;
	/** @type {?cw.net.HttpFormat} */
	this.httpFormat;
	/** @type {boolean} */
	this.requestNewStream;
	/** @type {string} */
	this.streamId;
	/** @type {string} */
	this.credentialsData;
	/** @type {boolean} */
	this.streamingResponse;
	/** @type {number} */
	this.needPaddingBytes;
	/** @type {number} */
	this.maxReceiveBytes;
	/** @type {?number} */
	this.maxOpenTime;
	/** @type {?number} */
	this.maxInactivity;
	/** @type {boolean} */
	this.useMyTcpAcks;
	/** @type {undefined|?number} */
	this.succeedsTransport;
	/** @type {string|cw.net.SACK} */
	this.sack;
	/** @type {string|!cw.net.SACK} */
	this.lastSackSeenByClient;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.HelloFrame.prototype.equals = function(other, eqLog) {
	if(!(other instanceof cw.net.HelloFrame)) {
		return false;
	}

	var myProperties = cw.net.HelloFrame.makePropertyArray_(this);
	var otherProperties = cw.net.HelloFrame.makePropertyArray_(other);

	return cw.eq.equals(myProperties, otherProperties, eqLog);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.HelloFrame.prototype.__reprPush__ = function(sb, stack) {
	// TODO: Make it actually human-readable, perhaps we need
	// an ordered HelloProperty_ list
	sb.push('<HelloFrame properties=');
	cw.repr.reprPush(cw.net.HelloFrame.makePropertyArray_(this), sb, stack);
	sb.push('>');
};

/**
 * Decodes a string from an untrusted source to a {@code cw.net.HelloFrame}.
 *
 * @param {string} frameString A string that ends with "H".
 * @return {!cw.net.HelloFrame}
 */
cw.net.HelloFrame.decode = function(frameString) {
	var json = cw.string.withoutLast(frameString, 1);
	// We want to prohibit JSON that has leading or trailing whitespace
	// (like Python Minerva does), so we do this test and make a dangerous
	// inference: if it starts with "{" and ends with "}" and evals successfully,
	// there was no leading/trailing whitespace.
	var startsWithCurly = cw.string.startsWithAlt(json, "{");
	var endsWithCurly = goog.string.endsWith(json, "}");
	if(!startsWithCurly || !endsWithCurly || !goog.json.isValid_(json)) {
		throw new cw.net.InvalidHello("Dangerous JSON or doesn't end with }");
	}
	/** @preserveTry */
	try {
		var blob = eval('(' + json + ')');
	} catch(e) {
		e = goog.debug.normalizeErrorObject(e);
		throw new cw.net.InvalidHello("Un-eval'able JSON: " + e.name + ": " + e.message);
	}

	// We know it is an !Object because of the careful "{" checking above.
	return cw.net.helloDataToHelloFrame_(
		new goog.structs.Map(/** @type {!Object.<*>} */ (blob)));
};

/**
 * @private
 * @param {!cw.net.HelloFrame} helloFrame
 * @return {!Array.<(number|string|boolean|null|undefined|cw.net.SACK)>}
 */
cw.net.HelloFrame.makePropertyArray_ = function(helloFrame) {
	return [
		helloFrame.transportNumber,
		helloFrame.protocolVersion,
		helloFrame.httpFormat,
		helloFrame.requestNewStream,
		helloFrame.streamId,
		helloFrame.credentialsData,
		helloFrame.streamingResponse,
		helloFrame.needPaddingBytes,
		helloFrame.maxReceiveBytes,
		helloFrame.maxOpenTime,
		helloFrame.maxInactivity,
		helloFrame.useMyTcpAcks,
		helloFrame.succeedsTransport,
		helloFrame.sack,
		helloFrame.lastSackSeenByClient
	];
};

cw.net.HelloFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.HelloFrame.prototype.encodeToPieces = function(sb) {
	var HP = cw.net.HelloProperty_;

	var compact = {};
	// TODO: optional parameters should probably be only set if goog.isDef(...)
	compact[HP.transportNumber] = this.transportNumber;
	compact[HP.protocolVersion] = this.protocolVersion;
	compact[HP.httpFormat] = this.httpFormat;
	compact[HP.requestNewStream] = this.requestNewStream;
	compact[HP.streamId] = this.streamId;
	compact[HP.credentialsData] = this.credentialsData;
	compact[HP.streamingResponse] = this.streamingResponse;
	compact[HP.needPaddingBytes] = this.needPaddingBytes;
	compact[HP.maxReceiveBytes] = this.maxReceiveBytes;
	if(goog.isDef(this.maxOpenTime)) {
		compact[HP.maxOpenTime] = this.maxOpenTime;
	}
	compact[HP.maxInactivity] = this.maxInactivity;
	compact[HP.useMyTcpAcks] = this.useMyTcpAcks;
	compact[HP.succeedsTransport] = this.succeedsTransport;

	if(this.sack instanceof cw.net.SACK) {
		compact[HP.sack] =
			cw.string.withoutLast(
				new cw.net.SackFrame(this.sack).encode(), 1);
	} else {
		compact[HP.sack] = this.sack;
	}

	if(this.lastSackSeenByClient instanceof cw.net.SACK) {
		compact[HP.lastSackSeenByClient] =
			cw.string.withoutLast(
				new cw.net.SackFrame(this.lastSackSeenByClient).encode(), 1);
	} else {
		compact[HP.lastSackSeenByClient] = this.lastSackSeenByClient;
	}

	// Remove the "undefined" values; TODO: don't do this so inefficiently
	for(var k in compact) {
		if(compact[k] === undefined) {
			delete compact[k];
		}
	}

	sb.push(goog.json.serialize(compact), 'H');
};

/**
 * @return {boolean} True if this HelloFrame indicates that
 *	client wants to receive strings, else false.
 */
cw.net.HelloFrame.prototype.wantsStrings = function() {
	// TODO: be safe against Object.prototype mutations?
	return this.succeedsTransport !== undefined;
};



/**
 * @param {string} string
 * @constructor
 */
cw.net.StringFrame = function(string) {
	/** @type {string} */
	this.string = string;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.StringFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.StringFrame &&
		this.string == other.string);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.StringFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new StringFrame(");
	cw.repr.reprPush(this.string, sb, stack);
	sb.push(")");
};

/**
 * @param {string} frameString A string that ends with " ".
 * 	Restricted string validation is not performed here, to accomodate
 * 	a future extension that allows expanding the allowed byte/char
 * 	range mid-Stream.
 * @return {!cw.net.StringFrame}
 */
cw.net.StringFrame.decode = function(frameString) {
	return new cw.net.StringFrame(frameString.substr(0, frameString.length - 1));
};

cw.net.StringFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.StringFrame.prototype.encodeToPieces = function(sb) {
	sb.push(this.string, ' ');
};



/**
 * @param {string} comment
 * @constructor
 */
cw.net.CommentFrame = function(comment) {
	/** @type {string} */
	this.comment = comment;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.CommentFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.CommentFrame &&
		this.comment == other.comment);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.CommentFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new CommentFrame(");
	cw.repr.reprPush(this.comment, sb, stack);
	sb.push(")");
};

/**
 * @param {string} frameString A string that ends with "^".
 * @return {!cw.net.CommentFrame}
 */
cw.net.CommentFrame.decode = function(frameString) {
	// This is a waste of CPU when we're just decoding a 4KB block of
	// padding, but oh well.
	return new cw.net.CommentFrame(frameString.substr(0, frameString.length - 1));
};

cw.net.CommentFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.CommentFrame.prototype.encodeToPieces = function(sb) {
	sb.push(this.comment, '^');
};



/**
 * @param {number} seqNum
 * @constructor
 */
cw.net.SeqNumFrame = function(seqNum) {
	/** @type {number} */
	this.seqNum = seqNum;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.SeqNumFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.SeqNumFrame &&
		this.seqNum == other.seqNum);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.SeqNumFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new SeqNumFrame(', String(this.seqNum), ')');
};

/**
 * @param {string} frameString A string that ends with "N".
 * @return {!cw.net.SeqNumFrame}
 */
cw.net.SeqNumFrame.decode = function(frameString) {
	var seqNum = cw.string.strToNonNegLimit(
		cw.string.withoutLast(frameString, 1),
		cw.math.LARGEST_INTEGER);
	if(seqNum == null) {
		throw new cw.net.InvalidFrame("bad seqNum");
	}
	return new cw.net.SeqNumFrame(seqNum);
};

cw.net.SeqNumFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.SeqNumFrame.prototype.encodeToPieces = function(sb) {
	sb.push(String(this.seqNum), 'N');
};



/**
 * @param {string} sackString A string containing SACK data.
 * @return {cw.net.SACK}
 * @private
 */
cw.net.sackStringToSack_ = function(sackString) {
	var parts = sackString.split('|');

	if(parts.length != 2) {
		return null;
	}

	var ackNumber = cw.string.strToIntInRange(
		parts[1], -1, cw.math.LARGEST_INTEGER);

	if(ackNumber == null) {
		return null;
	}

	var sackList = [];

	if(parts[0]) {
		var sackListStrs = parts[0].split(',');
		for(var i=0, len=sackListStrs.length; i < len; i++) {
			var sackNum = cw.string.strToNonNegLimit(sackListStrs[i], cw.math.LARGEST_INTEGER);
			if(sackNum == null) {
				return null;
			}
			sackList.push(sackNum);
		}
	}

	return new cw.net.SACK(ackNumber, sackList);
};


/**
 * @param {cw.net.SACK} sack
 * @param {!Array.<string>} sb The string buffer to append pieces of the
 * 	serialized SACK to.
 * @private
 */
cw.net.sackToSackStringPieces_ = function(sack, sb) {
	sb.push(sack.sackList.join(','), '|', String(sack.ackNumber));
};


/**
 * @param {!cw.net.SACK} sack
 * @constructor
 */
cw.net.SackFrame = function(sack) {
	/** @type {!cw.net.SACK} */
	this.sack = sack;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.SackFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.SackFrame &&
		this.sack.equals(other.sack, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.SackFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new SackFrame(');
	cw.repr.reprPush(this.sack, sb, stack);
	sb.push(')');
};

/**
 * @param {string} frameString A string that ends with "A".
 * @return {!cw.net.SackFrame}
 */
cw.net.SackFrame.decode = function(frameString) {
	var withoutTrailingChar = cw.string.withoutLast(frameString, 1);
	var sack = cw.net.sackStringToSack_(withoutTrailingChar);
	if(sack == null) {
		throw new cw.net.InvalidFrame("bad sack");
	}
	return new cw.net.SackFrame(sack);
};

cw.net.SackFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.SackFrame.prototype.encodeToPieces = function(sb) {
	cw.net.sackToSackStringPieces_(this.sack, sb);
	sb.push('A');
};




/**
 * @param {!cw.net.SACK} lastSackSeen
 * @constructor
 */
cw.net.StreamStatusFrame = function(lastSackSeen) {
	/** @type {!cw.net.SACK} */
	this.lastSackSeen = lastSackSeen;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.StreamStatusFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.StreamStatusFrame &&
		this.lastSackSeen.equals(other.lastSackSeen, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.StreamStatusFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new StreamStatusFrame(');
	cw.repr.reprPush(this.lastSackSeen, sb, stack);
	sb.push(')');
};

/**
 * @param {string} frameString A string that ends with "A".
 * @return {!cw.net.StreamStatusFrame}
 */
cw.net.StreamStatusFrame.decode = function(frameString) {
	var withoutTrailingChar = cw.string.withoutLast(frameString, 1);
	var sack = cw.net.sackStringToSack_(withoutTrailingChar);
	if(sack == null) {
		throw new cw.net.InvalidFrame("bad lastSackSeen");
	}
	return new cw.net.StreamStatusFrame(sack);
};

cw.net.StreamStatusFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.StreamStatusFrame.prototype.encodeToPieces = function(sb) {
	cw.net.sackToSackStringPieces_(this.lastSackSeen, sb);
	sb.push('T');
};




/**
 * @constructor
 */
cw.net.StreamCreatedFrame = function() {

};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.StreamCreatedFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new StreamCreatedFrame()');
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.StreamCreatedFrame.prototype.equals = function(other, eqLog) {
	return (other instanceof cw.net.StreamCreatedFrame);
};

/**
 * @param {string} frameString A string that ends with "C".
 * @return {!cw.net.StreamCreatedFrame}
 */
cw.net.StreamCreatedFrame.decode = function(frameString) {
	if(frameString.length != 1) {
		throw new cw.net.InvalidFrame("leading garbage");
	}
	return new cw.net.StreamCreatedFrame();
};

cw.net.StreamCreatedFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.StreamCreatedFrame.prototype.encodeToPieces = function(sb) {
	sb.push('C');
};




/**
 * @constructor
 */
cw.net.YouCloseItFrame = function() {

};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.YouCloseItFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new YouCloseItFrame()');
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.YouCloseItFrame.prototype.equals = function(other, eqLog) {
	return (other instanceof cw.net.YouCloseItFrame);
};

/**
 * @param {string} frameString A string that ends with "Y".
 * @return {!cw.net.YouCloseItFrame}
 */
cw.net.YouCloseItFrame.decode = function(frameString) {
	if(frameString.length != 1) {
		throw new cw.net.InvalidFrame("leading garbage");
	}
	return new cw.net.YouCloseItFrame();
};

cw.net.YouCloseItFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.YouCloseItFrame.prototype.encodeToPieces = function(sb) {
	sb.push('Y');
};



/**
 * @param {string} string
 * @return {boolean} Return true if {@code string}'s characters are all
 * 	within inclusive range 0x20 " " - 0x7E "~".
 * @private
 */
cw.net.isRestrictedString_ = function(string) {
	return /^([ -~]*)$/.test(string);
};


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
	/** @type {string} */
	this.reasonString = reasonString;
	/** @type {boolean} */
	this.applicationLevel = applicationLevel;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.ResetFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.ResetFrame &&
		this.reasonString == other.reasonString &&
		this.applicationLevel == other.applicationLevel);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.ResetFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new ResetFrame(");
	cw.repr.reprPush(this.reasonString, sb, stack);
	sb.push(", ", String(this.applicationLevel), ")");
};

/**
 * @param {string} frameString A string that ends with "!".
 * @return {!cw.net.ResetFrame}
 */
cw.net.ResetFrame.decode = function(frameString) {
	var reasonString = frameString.substr(0, frameString.length - 3);

	if(reasonString.length > 255 || !cw.net.isRestrictedString_(reasonString)) {
		throw new cw.net.InvalidFrame("bad reasonString");
	}

	// Either "|0" or "|1"
	var applicationLevelStr = frameString.substr(frameString.length - 3, 2);
	var applicationLevel = {'|0': false, '|1': true}[applicationLevelStr];
	if(applicationLevel == null) {
		throw new cw.net.InvalidFrame("bad applicationLevel");
	}

	return new cw.net.ResetFrame(reasonString, applicationLevel);
};

cw.net.ResetFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.ResetFrame.prototype.encodeToPieces = function(sb) {
	sb.push(this.reasonString, '|', String(Number(this.applicationLevel)), '!');
};




/**
 * Transport kill reasons. Keep in sync with minerva/newlink.py
 *
 * @enum {string}
 */
cw.net.TransportKillReason = {
	stream_attach_failure: 'stream_attach_failure',
	acked_unsent_strings: 'acked_unsent_strings',
	invalid_frame_type_or_arguments: 'invalid_frame_type_or_arguments',
	frame_corruption: 'frame_corruption',
	rwin_overflow: 'rwin_overflow'
};

/**
 * @type {!Object.<string, !cw.net.TransportKillReason>}
 *
 * @private
 */
cw.net.AllTransportKillReasons_ = {
	'stream_attach_failure': cw.net.TransportKillReason.stream_attach_failure,
	'acked_unsent_strings': cw.net.TransportKillReason.acked_unsent_strings,
	'invalid_frame_type_or_arguments': cw.net.TransportKillReason.invalid_frame_type_or_arguments,
	'frame_corruption': cw.net.TransportKillReason.frame_corruption,
	'rwin_overflow': cw.net.TransportKillReason.rwin_overflow
};


/**
 * @param {!cw.net.TransportKillReason} reason
 *
 * @constructor
 */
cw.net.TransportKillFrame = function(reason) {
	/** @type {!cw.net.TransportKillReason} */
	this.reason = reason;
};

/**
 * Test two frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.TransportKillFrame.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.TransportKillFrame &&
		this.reason == other.reason);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.TransportKillFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('new TransportKillFrame(');
	cw.repr.reprPush(this.reason, sb, stack);
	sb.push(')');
};

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
};

cw.net.TransportKillFrame.prototype.encode = cw.net.frameEncodeMethod_;

/**
 * @param {!Array.<string>} sb
 */
cw.net.TransportKillFrame.prototype.encodeToPieces = function(sb) {
	sb.push(this.reason, 'K');
};



/**
 * @type {(
 * 	cw.net.HelloFrame|
 * 	cw.net.StringFrame|
 * 	cw.net.SeqNumFrame|
 * 	cw.net.SackFrame|
 * 	cw.net.StreamStatusFrame|
 * 	cw.net.StreamCreatedFrame|
 * 	cw.net.YouCloseItFrame|
 * 	cw.net.CommentFrame|
 * 	cw.net.ResetFrame|
 * 	cw.net.TransportKillFrame
 * 	)}
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
};


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
	} else if(lastByte == "T") {
		return cw.net.StreamStatusFrame.decode(frameString);
	} else if(lastByte == "Y") {
		return cw.net.YouCloseItFrame.decode(frameString);
	} else if(lastByte == "^") {
		return cw.net.CommentFrame.decode(frameString);
	} else if(lastByte == "C") {
		return cw.net.StreamCreatedFrame.decode(frameString);
	} else if(lastByte == "!") {
		return cw.net.ResetFrame.decode(frameString);
	} else if(lastByte == "K") {
		return cw.net.TransportKillFrame.decode(frameString);
	} else {
		throw new cw.net.InvalidFrame("Invalid frame type " + lastByte);
	}
};