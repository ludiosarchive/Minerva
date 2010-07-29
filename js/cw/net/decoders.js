/**
 * @fileoverview Decoders that parse data from streaming XHR requests
 * 	by inspecting the `responseText` property.
 */

goog.provide('cw.net.ParseError');
goog.provide('cw.net.ResponseTextBencodeDecoder');
goog.provide('cw.net.ResponseTextNewlineDecoder');

goog.require('cw.string');
goog.require('cw.net.XHRLike');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Error');

/**
 * This is thrown when {@code ResponseTextBencodeDecoder} aborts parsing.
 * @param {string} msg Reason why parse failed
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.ParseError = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.ParseError, goog.debug.Error);
cw.net.ParseError.prototype.name = 'cw.net.ParseError';


/**
 * A netstrings-like decoder that solves two problems:
 *
 *    - decoding a series of bencode strings from an object with a
 * 		{@code responseText} that may grow.
 *
 *    - accessing the object's {@code responseText} only when necessary
 * 		to avoid memory-copying and excessive CPU use in some browsers
 * 		(Firefox, maybe others). This optimization is optional; see docstring
 * 		for {@code getNewStrings}.
 *
 * In Firefox, accessing an XHR object's {@code responseText} or
 * {@code responseText.length} repeatedly may cause it to copy all the
 * data in memory, causing memory usage fluctuations of ~50-80MB.
 *
 * This decoder must be manually "pushed" by calling {@code getNewStrings}.
 *
 * {@code xObject.responseText} is assumed to have unicode/byte equivalence.
 * Non-ASCII characters are forbidden, because of our optimizations,
 * and because of browser bugs related to XHR readyState 3.
 *
 * @param {!cw.net.XHRLike} xObject An XHR-like object with a
 * 	{@code responseText} property which is a string.
 *
 * @param {number} maxLength The maximum length of string to parse
 * 	(in characters, not bytes).
 *
 * @constructor
 */
cw.net.ResponseTextBencodeDecoder = function(xObject, maxLength) {
	/**
	 * The XHR or XHR-like object.
	 * @type {!cw.net.XHRLike}
	*/
	this.xObject = xObject;

	if(maxLength) {
		this.setMaxLength_(maxLength);
	}
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.ResponseTextBencodeDecoder.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.ResponseTextBencodeDecoder');

/**
 * The next location decoder will read.
 * @type {number}
 * @private
 */
cw.net.ResponseTextBencodeDecoder.prototype.offset_ = 0;

/**
 * A variable to optimize the decoder when the length of responseText
 * is known without looking at responseText.length
 * @type {number}
 * @private
 */
cw.net.ResponseTextBencodeDecoder.prototype.ignoreUntil_ = 1; // Need to have at least 1 byte before doing any parsing

/**
 * Private variable representing both the "mode" and "length to read".
 * 0 means mode LENGTH, >= 1 means mode DATA, and value represents
 * length to read.
 * @type {number}
 * @private
 */
cw.net.ResponseTextBencodeDecoder.prototype.modeOrReadLength_ = 0;

/**
 * The size of the largest string that the decoder will accept (in characters,
 * 	not bytes).
 * @type {number}
 * @private
 */
cw.net.ResponseTextBencodeDecoder.prototype.maxLength_ = 20 * 1024 * 1024;

/**
 * The length of {@code String(this.maxLength_)}
 * @type {number}
 * @private
 */
cw.net.ResponseTextBencodeDecoder.prototype.maxLengthLen_ = String(
	cw.net.ResponseTextBencodeDecoder.prototype.maxLength_).length;


/**
 * Set the maximum length.
 * @param {number} maxLength The new maximum length for the decoder.
 */
cw.net.ResponseTextBencodeDecoder.prototype.setMaxLength_ = function(maxLength) {
	this.maxLength_ = maxLength;
	this.maxLengthLen_ = String(maxLength).length;
};

/**
 * Check for new data in {@code xObject.responseText} and return an array
 * of new strings.
 *
 * If you know how many bytes are available in {@code responseText} through a
 * side-channel like an onprogress event, pass a number {@code responseTextLength}.
 * Passing a too-low {@code responseTextLength} is safe, but will obviously
 * fail to find some data. Pass {@code null} for {@code responseTextLength}
 * if you do not know how many bytes are in {@code responseText}.
 * See this class' docstring for rationale.
 *
 * {@code cw.net.ParseError} will be thrown if:
 *    - a string with character length greater than {@code this.maxLength_} is found.
 *    - if a corrupt length value is found (though the throwing may be delayed
 * 		for a few bytes).
 *
 * @param {?number} responseTextLength The already-known length of
 * {@code xObject.responseText}, or {@code null}.
 *
 * @return {!Array.<string>} an array of new strings
 */
cw.net.ResponseTextBencodeDecoder.prototype.getNewStrings = function(responseTextLength) {
	if(responseTextLength !== null && responseTextLength < this.ignoreUntil_) {
		// There certainly isn't enough data in responseText yet, so return.
		return [];
	}

	var text = this.xObject.responseText;

	// Users can lie about responseTextLength
	var reportedLength = responseTextLength;
	responseTextLength = text.length;
	if(reportedLength > responseTextLength) {
		this.logger_.fine(
			'Someone lied and reported a too-large responseTextLength: ' +
			reportedLength + '; should have been ' + responseTextLength + ' or lower.');
	}

	var strings = [];
	while(true) {
		if(this.modeOrReadLength_ === 0) { // mode LENGTH
			var colon = text.indexOf(':', this.offset_);
			if(colon === -1) {
				if(responseTextLength - this.offset_ > this.maxLengthLen_) {
					throw new cw.net.ParseError("length too long");
				}
				////console.log('No colon yet. Break.')
				break;
				// Unlike minerva._protocols, don't eager-fail if there are
				// non-digits; it's a waste of CPU time. We'll only be collecting
				// possibly-non-digits for maxLengthLen_ bytes.
			}

			var extractedLengthStr = text.substr(this.offset_, colon-this.offset_);
			// Accept only positive integers with no leading zero.
			// TODO: maybe disable this check for long-time user agents with no problems
			if(!cw.string.strictPositiveIntegerRe.test(extractedLengthStr)) {
				throw new cw.net.ParseError("corrupt length: " + extractedLengthStr);
			}
			// TODO: check if `+extractedLengthStr' is faster; use it if it is.
			var readLength = parseInt(extractedLengthStr, 10);
			if(readLength > this.maxLength_) {
				throw new cw.net.ParseError("length too long: " + readLength);
			}
			this.modeOrReadLength_ = readLength;
			this.offset_ += String(readLength).length + 1; // + 1 to skip over the ":"
		} else { // mode DATA
			if(this.offset_ + this.modeOrReadLength_ > responseTextLength) {
				////console.log('Not enough data bytes yet. Break.');
				break;
			}
			var s = text.substr(this.offset_, this.modeOrReadLength_);
			this.offset_ += this.modeOrReadLength_;
			this.modeOrReadLength_ = 0;
			strings.push(s);
		}
	}
	if(this.modeOrReadLength_ === 0) {
		// Can't ignore anything when still receiving the length
		this.ignoreUntil_ = responseTextLength + 1;
	} else {
		this.ignoreUntil_ = this.offset_ + this.modeOrReadLength_;
	}
	////console.log('ignoreUntil_ now', this.ignoreUntil_);
	return strings;
};



/**
 * A decoder that decodes newline-separated strings from an XHR object's
 * responseText, which may grow over time.  If a trailing carriage return ("\r")
 * is present in a string, it is stripped.  This decoder supports decoding
 * unicode strings (characters outside of ASCII range).
 *
 * @param {!cw.net.XHRLike} xObject An XHR-like object with a
 * 	{@code responseText} property which is a string.
 *
 * @param {number} maxLength The maximum length of string to parse
 * 	(in characters, not bytes).
 *
 * @constructor
 */
cw.net.ResponseTextNewlineDecoder = function(xObject, maxLength) {
	/**
	 * The XHR or XHR-like object.
	 * @type {!cw.net.XHRLike}
	*/
	this.xObject = xObject;

	/**
	 * @type {number}
	 * @private
	 */
	this.maxLength_ = maxLength;
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.ResponseTextNewlineDecoder.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.ResponseTextNewlineDecoder');

/**
 * The last-known length of xObject's responseText.  We use this number
 * to avoid searching for a newline in places we've already searched.
 * @type {number}
 * @private
 */
cw.net.ResponseTextNewlineDecoder.prototype.knownLength_ = 0;

/**
 * The start location of the next string.
 * @type {number}
 * @private
 */
cw.net.ResponseTextNewlineDecoder.prototype.offset_ = 0;

/**
 * Check for new data in {@code xObject.responseText} and return an array
 * of new strings.
 *
 * @param {?number=} responseTextLength Ignored.  For compatibility
 * 	with {@link cw.net.ResponseTextBencodeDecoder}.
 */
cw.net.ResponseTextNewlineDecoder.prototype.getNewStrings = function(responseTextLength) {
	var nSearchPos = this.knownLength_;
	var responseText = this.xObject.responseText;

	var strings = [];
	while(true) {
		var nPos = responseText.indexOf('\n', nSearchPos);
		if(nPos == -1) {
			break;
		}
		var str = responseText.substr(this.offset_, nPos-this.offset_);
		str = str.replace(/\r$/, '');
		strings.push(str);
		this.offset_ = nSearchPos = nPos + 1;
	}

	this.knownLength_ = responseText.length;
	return strings;
};
