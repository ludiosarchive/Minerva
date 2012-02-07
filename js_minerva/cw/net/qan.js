/**
 * @fileoverview QAN is a protocol that allows asking the peer a question and
 * receiving an answer or error-answer.  You can think of this as the "simplest
 * wire-level implementation of Deferreds", which is what AMP calls itself,
 * though QAN takes it even further: there is no command dispatching,
 * and requests/responses are completely unspecified.  (Though there are
 * some helper functions here that assume the requests/responses are
 * strings.)
 *
 * QAN does not require Minerva; you can use it over any bidirectional framed
 * stream.
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
goog.require('cw.deferred');
goog.require('cw.math');
goog.require('cw.record');
goog.require('cw.repr');
goog.require('cw.string');



/**
 * @param {*} body
 * @param {number} qid
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.Question = function(body, qid) {
	cw.record.Record.call(this, 'Question', [body, qid]);
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.qid = qid;
};
goog.inherits(cw.net.Question, cw.record.Record);



/**
 * @param {*} body
 * @param {number} qid
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.OkayAnswer = function(body, qid) {
	cw.record.Record.call(this, 'OkayAnswer', [body, qid]);
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.qid = qid;
};
goog.inherits(cw.net.OkayAnswer, cw.record.Record);



/**
 * @param {*} body
 * @param {number} qid
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.KnownErrorAnswer = function(body, qid) {
	cw.record.Record.call(this, 'KnownErrorAnswer', [body, qid]);
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.qid = qid;
};
goog.inherits(cw.net.KnownErrorAnswer, cw.record.Record);



/**
 * @param {*} body
 * @param {number} qid
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.UnknownErrorAnswer = function(body, qid) {
	cw.record.Record.call(this, 'UnknownErrorAnswer', [body, qid]);
	/** @type {*} */
	this.body = body;
	/** @type {number} */
	this.qid = qid;
};
goog.inherits(cw.net.UnknownErrorAnswer, cw.record.Record);



/**
 * @param {number} qid
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.Cancellation = function(qid) {
	cw.record.Record.call(this, 'Cancellation', [qid]);
	/** @type {number} */
	this.qid = qid;
};
goog.inherits(cw.net.Cancellation, cw.record.Record);



/**
 * @param {*} body
 * @extends {cw.record.Record}
 * @constructor
 */
cw.net.Notification = function(body) {
	cw.record.Record.call(this, 'Notification', [body]);
	/** @type {*} */
	this.body = body;
};
goog.inherits(cw.net.Notification, cw.record.Record);



/**
 * @typedef {(
 * 	cw.net.Question|
 * 	cw.net.OkayAnswer|
 * 	cw.net.KnownErrorAnswer|
 * 	cw.net.UnknownErrorAnswer|
 * 	cw.net.Cancellation|
 * 	cw.net.Notification
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
 * @param {!cw.net.QANFrame} qanFrame The QAN frame to encode.
 * 	Any QANFrame with a {@code .body} must have a {@code string}
 * 	{@code .body}.
 * @return {string} Encoded QAN frame
 */
cw.net.qanFrameToString = function(qanFrame) {
	var code = cw.net.qanTypeToCode_(qanFrame);
	if(qanFrame instanceof cw.net.Cancellation) {
		return String(qanFrame.qid) + code;
	} else {
		if(!goog.isString(qanFrame.body)) {
			throw Error("qanFrame.body must be a string, was " +
				cw.repr.repr(qanFrame.body));
		}

		if(qanFrame instanceof cw.net.Notification) {
			return qanFrame.body + code;
		} else {
			return qanFrame.body + "|" + String(qanFrame.qid) + code;
		}
	}
};


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
 * @param {string} s A qid encoded as a string
 * @return {number} qid
 * @throws {cw.net.InvalidQANFrame} If {@code s} is not a valid qid
 * @private
 */
cw.net.qidOrThrow_ = function(s) {
	var n = cw.string.strToNonNegLimit(s, cw.math.LARGEST_INTEGER);
	if(goog.isNull(n)) {
		throw new cw.net.InvalidQANFrame("bad qid");
	}
	return n;
};


/**
 * @param {string} frameString The QAN frame, encoded as a string
 * @return {!cw.net.QANFrame}
 * @throws {cw.net.InvalidQANFrame} If frameString is not a valid QAN frame.
 */
cw.net.stringToQANFrame = function(frameString) {
	if(!frameString) {
		throw new cw.net.InvalidQANFrame("0-length frame");
	}

	var lastByte = frameString.substr(frameString.length - 1, 1);

	if(lastByte == "#") {
		return new cw.net.Notification(cw.string.withoutLast(frameString, 1));
	} else if(lastByte == "C") {
		var qid = cw.net.qidOrThrow_(cw.string.withoutLast(frameString, 1));
		return new cw.net.Cancellation(qid);
	} else {
		var _ = cw.string.rsplit(frameString, '|', 1);
		var body = _[0];
		var rest = _[1];
		if(!goog.isDef(rest)) {
			throw new cw.net.InvalidQANFrame("Expected pipe char in frame");
		}
		var qid = cw.net.qidOrThrow_(cw.string.withoutLast(rest, 1));

		if(lastByte == "Q") {
			return new cw.net.Question(body, qid);
		} else if(lastByte == "K") {
			return new cw.net.OkayAnswer(body, qid);
		} else if(lastByte == "E") {
			return new cw.net.KnownErrorAnswer(body, qid);
		} else if(lastByte == "U") {
			return new cw.net.UnknownErrorAnswer(body, qid);
		} else {
			throw new cw.net.InvalidQANFrame(
				"Invalid QAN frame type " + cw.repr.repr(lastByte));
		}
	}
};

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
};


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
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.KnownError.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new KnownError(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(")");
};



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
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.UnknownError.prototype.__reprPush__ = function(sb, stack) {
	sb.push("new UnknownError(");
	cw.repr.reprPush(this.body, sb, stack);
	sb.push(")");
};



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
 * @param {function(*, boolean)} bodyReceived: The 2-arg function to call when
 * 	a Question or Notification is received (via a call to .handleString).
 * 	Called with arguments: body, isQuestion.
 *
 * @param {function(string, *)} logError: A 2-arg function called when
 * 	bodyReceived throws an error, or when QANHelper has a non-fatal
 * 	internal error.  Called with arguments: error message, error object.
 *
 * @param {function(!cw.net.QANFrame)} sendQANFrame: A 1-arg function that
 * 	sends a QAN frame to the peer.  Called with argument: qanFrame.
 *
 * @param {function(string)} fatalError: A 1-arg function called when QANHelper
 * 	can no longer handle QAN frames.  Called with argument: reason (a string
 * 	with chars in inclusive range 0x20 (SPACE) to 0x7E (~)).  After fatalError
 * 	is called, you must stop calling C{handleQANFrame} to prevent fatalError
 * 	from possibly being called again.
 *
 * @constructor
 */
cw.net.QANHelper = function(bodyReceived, logError, sendQANFrame, fatalError) {
	/**
	 * @type {function(*, boolean)}
	 * @private
	 */
	this.bodyReceived_ = bodyReceived;
	/**
	 * @type {function(string, *)}
	 * @private
	 */
	this.logError_ = logError;
	/**
	 * @type {function(!cw.net.QANFrame)}
	 * @private
	 */
	this.sendQANFrame_ = sendQANFrame;
	/**
	 * @type {function(string)}
	 * @private
	 */
	this.fatalError_ = fatalError;

	/**
	 * @type {number}
	 * @private
	 */
	this.qidCounter_ = 0;
	/**
	 * @type {!goog.structs.Map}
	 * @private
	 */
	this.ourQuestions_ = new goog.structs.Map();
	/**
	 * @type {!goog.structs.Map}
	 * @private
	 */
	this.theirQuestions_ = new goog.structs.Map();
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.QANHelper.prototype.__reprPush__ = function(sb, stack) {
	sb.push("<QANHelper asked ", String(this.qidCounter_), " questions, " +
		"waiting for ", String(this.ourQuestions_.getCount()), " peer answers and ",
		String(this.theirQuestions_.getCount()), " local answers>");
};

/**
 * @param {*} body
 * @param {number} qid
 * @private
 */
cw.net.QANHelper.prototype.sendOkayAnswer_ = function(body, qid) {
	this.theirQuestions_.remove(qid);
	this.sendQANFrame_(new cw.net.OkayAnswer(body, qid));
};

/**
 * @param {*} error
 * @param {number} qid
 * @private
 */
cw.net.QANHelper.prototype.sendErrorAnswer_ = function(error, qid) {
	this.theirQuestions_.remove(qid);
	if(error instanceof cw.net.KnownError) {
		this.sendQANFrame_(new cw.net.KnownErrorAnswer(error.body, qid));
	} else if(error instanceof goog.async.Deferred.CancelledError) {
		this.sendQANFrame_(new cw.net.UnknownErrorAnswer("CancelledError", qid));
	} else {
		this.logError_("Peer's Question #" + qid +" caused uncaught exception", error);
		// We intentionally do not reveal information about the
		// exception.
		this.sendQANFrame_(new cw.net.UnknownErrorAnswer("Uncaught exception", qid));
	}
};

/**
 * @param {!cw.net.QANFrame} qanFrame
 */
cw.net.QANHelper.prototype.handleQANFrame = function(qanFrame) {
	if(cw.net.isAnswerFrame(qanFrame)) {
		var qid = qanFrame.qid;
		var d = this.ourQuestions_.get(qid);
		this.ourQuestions_.remove(qid);
		if(!goog.isDef(d)) {
			this.fatalError_("Received an answer with invalid qid: " + qid);
			return;
		}

		if(goog.isNull(d)) {
			// Ignore the answer to a question we cancelled or failAll'ed.
		} else if(qanFrame instanceof cw.net.OkayAnswer) {
			d.callback(qanFrame.body);
		} else if(qanFrame instanceof cw.net.KnownErrorAnswer) {
			d.errback(new cw.net.KnownError(qanFrame.body));
		} else if(qanFrame instanceof cw.net.UnknownErrorAnswer) {
			d.errback(new cw.net.UnknownError(qanFrame.body));
		} else {
			throw Error("handleQANFrame bug");
		}

	} else if(qanFrame instanceof cw.net.Notification) {
		try {
			this.bodyReceived_(qanFrame.body, false);
		} catch(e) {
			this.logError_("Peer's Notification caused uncaught " +
				"exception", e);
		}

	} else if(qanFrame instanceof cw.net.Question) {
		var qid = qanFrame.qid;
		if(this.theirQuestions_.containsKey(qid)) {
			this.fatalError_("Received Question with duplicate qid: " + qid);
			return;
		}
		var d = cw.deferred.maybeDeferred(
			this.bodyReceived_, [qanFrame.body, true]);
		this.theirQuestions_.set(qid, d);
		var that = this;
		d.addCallbacks(
			function(body) {
				that.sendOkayAnswer_(body, qid);
				return null;
			},
			function(error) {
				that.sendErrorAnswer_(error, qid);
				return null;
			}
		);
		d.addErrback(function(err) {
			this.logError_("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", err);
			return null;
		});

	} else if(qanFrame instanceof cw.net.Cancellation) {
		var qid = qanFrame.qid;

		// We don't .remove(qid) here because a cancelled Deferred
		// still goes through the callback or errback chain, and
		// our sendOkayAnswer_ and sendErrorAnswer_
		// deletes it from this.theirQuestions_.
		var d = this.theirQuestions_.get(qid);
		if(goog.isDef(d)) {
			d.cancel();
		}
		// Cancellations for nonexistent questions are ignored.
	}
};

/**
 * @param {number} qid
 * @private
 */
cw.net.QANHelper.prototype.sendCancel_ = function(qid) {
	this.ourQuestions_.set(qid, null);

	// Note: when we cancel something, we still expect to get either
	// an OkayAnswer or *ErrorAnswer from the peer, at least in the
	// typical case where the Stream does not reset.
	this.sendQANFrame_(new cw.net.Cancellation(qid));

	// Because we don't call .callback or .errback in this canceller,
	// Deferred calls .errback(CancelledError()) for us.
};

/**
 * Send a Question to the peer.
 *
 * @param {*} body The question body
 * @return {!goog.async.Deferred} a Deferred that will callback the response
 * 	object, or errback with {@code KnownError} or {@code UnknownError} or
 * 	{@code QuestionFailed}.
 */
cw.net.QANHelper.prototype.ask = function(body) {
	this.qidCounter_ += 1;
	var qid = this.qidCounter_;
	this.sendQANFrame_(new cw.net.Question(body, qid));

	goog.asserts.assert(!this.ourQuestions_.containsKey(qid));
	var that = this;
	var d = new goog.async.Deferred(function() {
		that.sendCancel_(qid);
	});
	this.ourQuestions_.set(qid, d);
	return d;
};

/**
 * Send a Notification to the peer.
 *
 * @param {*} body The notification body
 */
cw.net.QANHelper.prototype.notify = function(body) {
	this.sendQANFrame_(new cw.net.Notification(body));
};

/**
 * Errback all of our questions with {@code QuestionFailed}.
 *
 * @param {string} reason Reason for failing; used as the
 * 	{@code QuestionFailed} error message.
 */
cw.net.QANHelper.prototype.failAll = function(reason) {
	var keys = this.ourQuestions_.getKeys();
	for(var i=0; i < keys.length; i++) {
		var d = this.ourQuestions_.get(keys[i]);
		// isDef just in case a very buggy errback mutated ourQuestions_
		if(goog.isDef(d)) {
			this.ourQuestions_.set(keys[i], null);
			d.errback(new cw.net.QuestionFailed(reason));
		}
	}
};
