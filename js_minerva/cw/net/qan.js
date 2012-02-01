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

goog.require('goog.asserts');
goog.require('goog.debug.Error');
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



/**
 * @typedef {(
 * 	cw.net.Question|
 * 	cw.net.OkayAnswer|
 * 	cw.net.KnownErrorAnswer|
 * 	cw.net.UnknownErrorAnswer|
 * 	cw.net.Cancellation|
 * 	cw.net.Notification|
 * 	)}
 */
cw.net.QANFrame;



/**
 * @param {!cw.net.QANFrame} frame
 * @return {string}
 * @private
 */
cw.net.qanTypeToCode_ = function(frame) {
	if(frame instanceof cw.net.Question) {
		return "Q";
	} else if(frame instanceof cw.net.OkayAnswer) {
		return "K";
	} else if(frame instanceof cw.net.KnownErrorAnswer) {
		return "E";
	} else if(frame instanceof cw.net.UnknownErrorAnswer) {
		return "U";
	} else if(frame instanceof cw.net.Cancellation) {
		return "C";
	} else if(frame instanceof cw.net.Notification) {
		return "#";
	} else {
		throw Error("qanTypeToCode bug");
	}
};


/**
 * @param {!cw.net.QANFrame} qanFrame The QAN frame to encode:
 * 	a L{Question} or L{OkayAnswer} or L{KnownErrorAnswer} or
 * 	L{UnknownErrorAnswer} or L{Cancellation} or L{Notification}, all of
 * 	which must have a C{str} C{.body}.  (Except for L{Cancellation},
 * 	which has no C{.body}.)
 * @return {string} Encoded QAN frame
 */
cw.net.qanFrameToString = function(qanFrame) {
	var code = cw.net.qanTypeToCode_(qanFrame);
	if(qanFrame instanceof cw.net.Cancellation) {
		return String(qanFrame.qid) + code
	} else {
		if(!goog.isString(qanFrame.body)) {
			throw Error("qanFrame.body must be a str, was " +
				cw.repr.repr(qanFrame.body))
		}

		if(qanFrame instanceof cw.net.Notification) {
			return qanFrame.body + code
		} else {
			return qanFrame.body + "|" + String(qanFrame.qid) + code
		}
	}
}



/**
 * @param {string} message
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.InvalidQANFrame = function(message) {
	goog.debug.Error.call(this);

	/**
	 * @type {string}
	 */
	this.message = message;
};
goog.inherits(cw.net.InvalidQANFrame, goog.debug.Error);



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
	if(!frameString) {
		throw new cw.net.InvalidQANFrame("0-length frame");
	}

	var lastByte = frameString.substr(frameString.length - 1, 1);

	if(lastByte == "#") {
		return new cw.net.Notification(cw.string.withoutLast(frameString, 1))
	} else if(lastByte == "C") {
		var qid = cw.net.qidOrThrow_(cw.string.withoutLast(frameString, 1))
		return new cw.net.Cancellation(qid)
	} else {
		var _ = cw.string.rsplit(frameString, '|', 1);
		var body = _[0];
		var rest = _[1];
		if(!goog.isDef(rest)) {
			throw new cw.net.InvalidQANFrame("Expected pipe char in frame")
		}
		var qid = cw.net.qidOrThrow_(cw.string.withoutLast(rest, 1))

		if(lastByte == "Q") {
			return new cw.net.Question(body, qid)
		} else if(lastByte == "K") {
			return new cw.net.OkayAnswer(body, qid)
		} else if(lastByte == "E") {
			return new cw.net.KnownErrorAnswer(body, qid)
		} else if(lastByte == "U") {
			return new cw.net.UnknownErrorAnswer(body, qid)
		} else {
			throw new cw.net.InvalidQANFrame(
				"Invalid QAN frame type " + cw.repr.repr(lastByte));
		}
	}
}

/**
 * @param {!cw.net.QANFrame} qanFrame
 * @return {boolean} Is qanFrame an OkayAnswer, KnownErrorAnswer, or
 * 	UnknownErrorAnswer?
 */
cw.net.isAnswerFrame = function(qanFrame) {
	return (
		qanFrame instanceof cw.net.OkayAnswer ||
		qanFrame instanceof cw.net.KnownErrorAnswer ||
		qanFrame instanceof cw.net.UnknownErrorAnswer);
}


/**
 * @param {*} body
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.KnownError = function(body) {
	goog.debug.Error.call(this);

	/**
	 * @type {*}
	 */
	this.body = body;
};
goog.inherits(cw.net.KnownError, goog.debug.Error);


/**
 * Message text.
 * @type {string}
 * @override
 */
cw.net.KnownError.prototype.message = 'KnownError with arbitrary body';



/**
 * @param {*} body
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.UnknownError = function(body) {
	goog.debug.Error.call(this);

	/**
	 * @type {*}
	 */
	this.body = body;
};
goog.inherits(cw.net.UnknownError, goog.debug.Error);


/**
 * Message text.
 * @type {string}
 * @override
 */
cw.net.UnknownError.prototype.message = 'UnknownError with arbitrary body';



/**
 * @param {string} message
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.QuestionFailed = function(message) {
	goog.debug.Error.call(this);

	/**
	 * @type {string}
	 */
	this.message = message;
};
goog.inherits(cw.net.QuestionFailed, goog.debug.Error);



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
		Called with arguments: error message, error object.

	@param sendQANFrame: A 1-arg function that sends a QAN frame to the
		peer.  Called with argument: qanFrame.

	@param fatalError: A 1-arg function called when QANHelper can no longer
		handle QAN frames.  Called with argument: reason (a string with chars
		in inclusive range 0x20 (SPACE) to 0x7E (~)).  After fatalError is called,
		you must stop calling C{handleQANFrame} to prevent fatalError from
		possibly being called again.
	*/
	this.bodyReceived_ = bodyReceived;
	this.logError_ = logError;
	this.sendQANFrame_ = sendQANFrame;
	this.fatalError_ = fatalError;

	this.qidCounter_ = 0
	this.ourQuestions_ = new goog.structs.Map();
	this.theirQuestions_ = new goog.structs.Map();
}

cw.net.QANHelper.prototype.__repr__ = function() {
	return ('<QANHelper asked %d questions, waiting for %d peer answers '
		'and %d local answers>') % (
			this.qidCounter_, this.ourQuestions_.getCount(),
			this.theirQuestions_.getCount())
}

/**
 * @private
 */
cw.net.QANHelper.prototype.sendOkayAnswer_ = function(body, qid) {
	this.theirQuestions_.remove(qid)
	this.sendQANFrame_(new cw.net.OkayAnswer(body, qid))
	return null;
}

/**
 * @private
 */
cw.net.QANHelper.prototype.sendErrorAnswer_ = function(error, qid) {
	this.theirQuestions_.remove(qid)
	if(error instanceof cw.net.KnownError) {
		this.sendQANFrame_(new cw.net.KnownErrorAnswer(error.body, qid))
	} else if(error instanceof goog.async.Deferred.CancelledError) {
		this.sendQANFrame_(new cw.net.UnknownErrorAnswer("CancelledError", qid))
	} else {
		this.logError_("Peer's Question #" + qid +" caused uncaught exception", error)
		// We intentionally do not reveal information about the
		// exception.
		this.sendQANFrame_(new cw.net.UnknownErrorAnswer("Uncaught exception", qid))
	}
	return null;
}

cw.net.QANHelper.prototype.handleQANFrame = function(qanFrame) {
	if(cw.net.isAnswerFrame(qanFrame)) {
		var qid = qanFrame.qid
		var d = this.ourQuestions_.get(qid)
		this.ourQuestions_.remove(qid);
		if(!goog.isDef(d)) {
			this.fatalError_("Received an answer with invalid qid: " + qid)
			return
		}

		if(goog.isNull(d)) {
			// Ignore the answer to a question we cancelled or failAll'ed.
		} else if(qanFrame instanceof cw.net.OkayAnswer) {
			d.callback(qanFrame.body)
		} else if(qanFrame instanceof KnownErrorAnswer) {
			d.errback(new cw.net.KnownError(qanFrame.body))
		} else if(qanFrame instanceof UnknownErrorAnswer) {
			d.errback(new cw.net.UnknownError(qanFrame.body))
		} else {
			throw Error("handleQANFrame bug")
		}

	} else if(qanFrame instanceof cw.net.Notification) {
		try {
			this.bodyReceived_(qanFrame.body, false)
		} catch(e) {
			this.logError_("Peer's Notification caused uncaught " +
				"exception", e)
		}

	} else if(qanFrame instanceof cw.net.Question) {
		var qid = qanFrame.qid
		if(this.theirQuestions_.containsKey(qid)) {
			this.fatalError_("Received Question with duplicate qid: " + qid)
			return
		var d = cw.deferred.maybeDeferred(
			this.bodyReceived_, qanFrame.body, true)
		this.theirQuestions_[qid] = d
		d.addCallbacks(
			this.sendOkayAnswer_, this.sendErrorAnswer_,
			callbackArgs=(qid,), errbackArgs=(qid,))
		d.addErrback(function(err) {
			this.logError_("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", err);
			return null;
		});

	} else if(qanFrame instanceof cw.net.Cancellation) {
		var qid = qanFrame.qid
		try {
			// We don't .pop() it here because a cancelled Deferred
			// still goes through the callback or errback chain, and
			// our _sendOkayAnswer and _sendErrorAnswer
			// deletes it from this.theirQuestions_.
			var d = this.theirQuestions_[qid]
		} catch(e) { // FIXME: check for KeyError
			// Cancellations for nonexistent questions are ignored.
		} else {
			d.cancel()
		}
	}
}

cw.net.QANHelper.prototype.sendCancel_ = function(qid) {
	this.ourQuestions_.set(qid, null)

	// Note: when we cancel something, we still expect to get either
	// an OkayAnswer or *ErrorAnswer from the peer, at least in the
	// typical case where the Stream does not reset.
	this.sendQANFrame_(new cw.net.Cancellation(qid))

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
	var qid = this.qidCounter_
	this.sendQANFrame_(new cw.net.Question(body, qid))

	goog.asserts.assert(!this.ourQuestions_.containsKey(qid))
	var d = new goog.async.Deferred(lambda _: this.sendCancel_(qid))
	this.ourQuestions_.set(qid, d)
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
	this.sendQANFrame_(new cw.net.Notification(body))
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
		this.ourQuestions_.set(qid, null)
		d.errback(new cw.net.QuestionFailed(reason))
}
