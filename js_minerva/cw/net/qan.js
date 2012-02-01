/**
 * QAN is a protocol that allows asking the peer a question and receiving an
 answer or error-answer.  You can think of this as the "simplest wire-level
 implementation of Deferreds", which is what AMP calls itself, though QAN takes
 it even further: there is no command dispatching, and requests/responses
 are completely unspecified.  (Though there are some helper functions here
 that assume the requests/responses are bytestrings.)

 QAN does not require Minerva; you can use it over any bidirectional framed
 stream.
 */

goog.provide('cw.net.stringToQANFrame');
goog.provide('cw.net.qanFrameToString');
goog.provide('cw.net.InvalidQANFrame');
goog.provide('cw.net.QANHelper');
goog.provide('cw.net.KnownError');
goog.provide('cw.net.UnknownError');
goog.provide('cw.net.QuestionFailed');

goog.require('goog.structs.Map');
goog.require('cw.math');
goog.require('cw.repr');
goog.require('cw.string');



/**
 * @param {*} body
 * @param {number} id
 * @constructor
 */
cw.net.Question = function(body, id) {
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.id = id;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.Question.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.Question &&
		this.id == other.id &&
		cw.eq.equals(this.body, other.body, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.Question.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new Question(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(", ", String(this.id), ")");
};



/**
 * @param {*} body
 * @param {number} id
 * @constructor
 */
cw.net.OkayAnswer = function(body, id) {
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.id = id;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.OkayAnswer.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.OkayAnswer &&
		this.id == other.id &&
		cw.eq.equals(this.body, other.body, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.OkayAnswer.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new OkayAnswer(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(", ", String(this.id), ")");
};



/**
 * @param {*} body
 * @param {number} id
 * @constructor
 */
cw.net.KnownErrorAnswer = function(body, id) {
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.id = id;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.KnownErrorAnswer.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.KnownErrorAnswer &&
		this.id == other.id &&
		cw.eq.equals(this.body, other.body, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.KnownErrorAnswer.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new KnownErrorAnswer(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(", ", String(this.id), ")");
};



/**
 * @param {*} body
 * @param {number} id
 * @constructor
 */
cw.net.UnknownErrorAnswer = function(body, id) {
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.id = id;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.UnknownErrorAnswer.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.UnknownErrorAnswer &&
		this.id == other.id &&
		cw.eq.equals(this.body, other.body, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.UnknownErrorAnswer.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new UnknownErrorAnswer(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(", ", String(this.id), ")");
};



/**
 * @param {number} id
 * @constructor
 */
cw.net.Cancellation = function(id) {
	/** @type {number} */
	this.id = id;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.Cancellation.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.Cancellation &&
		this.id == other.id);
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.Cancellation.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new Cancellation(", String(this.id), ")");
};



/**
 * @param {*} body
 * @constructor
 */
cw.net.Notification = function(body) {
	/** @type {*} */
	this.body = body;
};

/**
 * Test two QAN frames for equality.
 * @param {*} other
 * @param {Array.<string>=} eqLog
 * @return {boolean}
 */
cw.net.Notification.prototype.equals = function(other, eqLog) {
	return (
		other instanceof cw.net.Notification &&
		cw.eq.equals(this.body, other.body, eqLog));
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.Notification.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new Notification(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(")");
};



cw.net.qanTypeToCode = {
	 Question: "Q"
	,OkayAnswer: "K"
	,KnownErrorAnswer: "E"
	,UnknownErrorAnswer: "U"
	,Cancellation: "C"
	,Notification: "#"
}


cw.net.qanFrameToString = function(qanFrame) {
	/*
	@param qanFrame: The QAN frame to encode
	@type qanFrame: a L{Question} or L{OkayAnswer} or L{KnownErrorAnswer} or
		L{UnknownErrorAnswer} or L{Cancellation} or L{Notification}, all of
		which must have a C{str} C{.body}.  (Except for L{Cancellation},
		which has no C{.body}.)

	@return: The encoded QAN frame
	@rtype: str
	*/
	var qanFrameType = type(qanFrame)
	var code = qanTypeToCode[qanFrameType]
	if(qanFrameType == Cancellation) {
		return String(qanFrame.qid) + code
	} else {
		if(!goog.isString(qanFrame.body)) {
			throw Error("qanFrame.body must be a str, was " +
				cw.repr.repr(qanFrame.body))
		}

		if(qanFrameType == Notification) {
			return qanFrame.body + code
		} else {
			return qanFrame.body + "|" + String(qanFrame.qid) + code
		}
	}
}

// FIXME: class InvalidQANFrame: Add constructor function if missing
	pass


/**
 * @private
 */
cw.net.qidOrThrow_ = function(s) {
	var n = cw.string.strToNonNegLimit(s, cw.math.LARGEST_INTEGER);
	if(n == null) {
		throw new InvalidQANFrame("bad qid")
	}
	return n;
}

cw.net.stringToQANFrame = function(frameString) {
	/*
	@param frameString: The QAN frame, encoded as a string
	@type frameString: C{str}

	@return: The QAN frame
	@rtype qf: a L{Question} or L{OkayAnswer} or L{ErrorAnswer} or
		L{Cancellation} or L{Notification}, with a C{str} C{.body}.
	*/
	try {
		var lastByte = frameString[-1]
	} catch(e) { // FIXME: check for IndexError
		throw new InvalidQANFrame("0-length frame")
	}

	if(lastByte == "#") {
		return Notification(frameString[:-1])
	} else if(lastByte == "C") {
		var qid = _qidOrThrow(frameString[:-1])
		return Cancellation(qid)
	} else {
		try {
			body, rest = frameString.rsplit('|', 1)
		} catch(e) { // FIXME: check for ValueError
			throw new InvalidQANFrame("Expected pipe char in frame")
		}
		var qid = _qidOrThrow(rest[:-1])

		if(lastByte == "Q") {
			return Question(body, qid)
		} else if(lastByte == "K") {
			return OkayAnswer(body, qid)
		} else if(lastByte == "E") {
			return KnownErrorAnswer(body, qid)
		} else if(lastByte == "U") {
			return UnknownErrorAnswer(body, qid)
		} else {
			throw new InvalidQANFrame("Invalid QAN frame type %r" % lastByte)
		}
	}
}

cw.net.isAnswerFrame = function(qanFrame) {
	return isinstance(qanFrame, (OkayAnswer, KnownErrorAnswer, UnknownErrorAnswer))
}


// FIXME: class KnownError: Add constructor function if missing
	pass



// FIXME: class UnknownError: Add constructor function if missing
	pass



// FIXME: class QuestionFailed: Add constructor function if missing
	pass


/**
 * @constructor
 */
cw.net.QANHelper = function(bodyReceived, logError, sendQANFrame, fatalError) {
	/*
	@param bodyReceived: The 2-arg function to call when
		a Question or Notification is received (via a call to .handleString).
		Called with arguments: body, isQuestion.

	@param logError: A 2-arg function called when bodyReceived raises
		an exception, or when QANHelper has a non-fatal internal error.
		Called with arguments: error message, L{Failure} object

	@param sendQANFrame: A 1-arg function that sends a QAN frame to the
		peer.  Called with argument: qanFrame.

	@param fatalError: A 1-arg function called when QANHelper can no longer
		handle QAN frames.  Called with argument: reason (a C{str} with bytes
		in inclusive range 0x20 (SPACE) to 0x7E (~)).  After fatalError is called,
		you must stop calling C{handleQANFrame} to prevent fatalError from
		possibly being called again.
	*/
	this.bodyReceived_ = bodyReceived
	this.logError_ = logError
	this.sendQANFrame_ = sendQANFrame
	this.fatalError_ = fatalError

	this.qidCounter_ = 0
	this.ourQuestions_ = {}
	this.theirQuestions_ = {}
}

cw.net.QANHelper.prototype.__repr__ = function() {
	return ('<%s asked %d questions, waiting for %d peer answers '
		'and %d local answers>') % (this._class___.__name__,
			this.qidCounter_, len(this.ourQuestions_),
			len(this.theirQuestions_))
}

/**
 * @private
 */
cw.net.QANHelper.prototype.sendOkayAnswer_ = function(s, qid) {
	del this.theirQuestions_[qid]
	this.sendQANFrame_(cw.net.OkayAnswer(s, qid))
}

/**
 * @private
 */
cw.net.QANHelper.prototype.sendErrorAnswer_ = function(failure, qid) {
	del this.theirQuestions_[qid]
	if(failure.check(KnownError)) {
		this.sendQANFrame_(cw.net.KnownErrorAnswer(failure.value[0], qid))
	} else if(failure.check(defer.CancelledError)) {
		this.sendQANFrame_(cw.net.UnknownErrorAnswer("CancelledError", qid))
	} else {
		this.logError_("Peer's Question #%d caused uncaught "
			"exception" % (qid,), failure)
		// We intentionally do not reveal information about the
		// exception.
		this.sendQANFrame_(cw.net.UnknownErrorAnswer("Uncaught exception", qid))
	}
}

cw.net.QANHelper.prototype.handleQANFrame = function(qanFrame) {
	if(isAnswerFrame(qanFrame)) {
		var qid = qanFrame.qid
		try {
			var d = this.ourQuestions_.pop(qid)
		} catch(e) { // FIXME: check for KeyError
			this.fatalError_("Received an answer with invalid qid: %d" % (qid,))
			return
		}

		if(d is null) {
			// Ignore the answer to a question we cancelled or failAll'ed.
		} else if(qanFrame instanceof cw.net.OkayAnswer) {
			d.callback(qanFrame.body)
		} else if(qanFrame instanceof KnownErrorAnswer) {
			d.errback(KnownError(qanFrame.body))
		} else if(qanFrame instanceof UnknownErrorAnswer) {
			d.errback(UnknownError(qanFrame.body))
		} else {
			throw Error("handleQANFrame bug")
		}

	} else if(qanFrame instanceof cw.net.Notification) {
		try {
			this.bodyReceived_(qanFrame.body, false)
		} catch(e) { // FIXME: check for Exception
			this.logError_("Peer's Notification caused uncaught "
				"exception", failure.Failure())
		}

	} else if(qanFrame instanceof cw.net.Question) {
		var qid = qanFrame.qid
		if(qid in this.theirQuestions_) {
			this.fatalError_("Received Question with duplicate qid: %d" % (qid,))
			return
		var d = cw.deferred.maybeDeferred(
			this.bodyReceived_, qanFrame.body, true)
		this.theirQuestions_[qid] = d
		d.addCallbacks(
			this.sendOkayAnswer_, this.sendErrorAnswer_,
			callbackArgs=(qid,), errbackArgs=(qid,))
		d.addErrback(lambda failure: this.logError_(
			"Bug in QANHelper._sendOkayAnswer or _sendErrorAnswer", failure))

	} else if(qanFrame instanceof cw.net.Cancellation) {
		var qid = qanFrame.qid
		try {
			// We don't .pop() it here because a cancelled Deferred
			// still goes through the callback or errback chain, and
			// our _sendOkayAnswer and _sendErrorAnswer
			// deletes it from this.theirQuestions_.
			d = this.theirQuestions_[qid]
		} catch(e) { // FIXME: check for KeyError
			// Cancellations for nonexistent questions are ignored.
		} else {
			d.cancel()
		}
	}
}

cw.net.QANHelper.prototype.sendCancel_ = function(qid) {
	this.ourQuestions_[qid] = null

	// Note: when we cancel something, we still expect to get either
	// an OkayAnswer or *ErrorAnswer from the peer, at least in the
	// typical case where the Stream does not reset.
	this.sendQANFrame_(cw.net.Cancellation(qid))

	// Because we don't call .callback or .errback in this canceller,
	// Deferred calls .errback(CancelledError()) for us.
}

cw.net.QANHelper.prototype.ask = function(body) {
	/*
	Send a Question to the peer.

	@param body: The question body
	@type body: *

	@return: a Deferred that will callback the response object, or errback
		with L{KnownError} or L{UnknownError} or L{QuestionFailed}.
	@rtype: L{defer.Deferred}
	*/
	this.qidCounter_ += 1
	qid = this.qidCounter_
	this.sendQANFrame_(cw.net.Question(body, qid))

	goog.asserts.assert(qid not in this.ourQuestions_)
	d = new goog.async.Deferred(lambda _: this.sendCancel_(qid))
	this.ourQuestions_[qid] = d
	return d
}

cw.net.QANHelper.prototype.notify = function(body) {
	/*
	Send a Notification to the peer.

	@param body: The notification body
	@type body: *

	@return: null
	@rtype: C{null}
	*/
	this.sendQANFrame_(cw.net.Notification(body))
}

cw.net.QANHelper.prototype.failAll = function(reason) {
	/*
	Errback all of our questions with L{QuestionFailed}.

	@param reason: Reason for failing; used as the L{QuestionFailed}
		exception message.
	@type reason: C{str}
	*/
	// .copy() because some buggy errback might .ask() a question
	for qid, d in this.ourQuestions_.copy().iteritems():
		this.ourQuestions_[qid] = null
		d.errback(cw.net.QuestionFailed(reason))
}
