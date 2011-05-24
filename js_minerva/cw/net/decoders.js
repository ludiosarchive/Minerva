/**
 * @fileoverview Decoders that parse data from streaming XHR requests
 * 	by inspecting the `responseText` property.
 */

goog.provide('cw.net.ResponseTextNewlineDecoder');
goog.provide('cw.net.DecodeStatus');

goog.require('cw.net.XHRLike');


/**
 * Status codes returned by {@code getNewString}.
 * @enum {number}
 */
cw.net.DecodeStatus = {
	OK: 1,
	TOO_LONG: 2
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
 * Have we given up on decoding because we previously hit maxLength_
 * and returned TOO_LONG?
 * @type {boolean}
 * @private
 */
cw.net.ResponseTextNewlineDecoder.prototype.failed_ = false;

/**
 * Check for new data in {@code xObject.responseText} and return an array
 * of new strings.
 *
 * @return {!Array.<(!Array.<string>|!cw.net.DecodeStatus)>} An array of new
 * 	strings, and a decode status.
 * // TODO: types for tuples
 */
cw.net.ResponseTextNewlineDecoder.prototype.getNewStrings = function() {
	var strings = [];

	if(this.failed_) {
		return [strings, cw.net.DecodeStatus.TOO_LONG];
	}

	var nSearchPos = this.knownLength_;
	var responseText = this.xObject.responseText;
	this.knownLength_ = responseText.length;

	while(true) {
		var nPos = responseText.indexOf('\n', nSearchPos);
		if(nPos == -1) {
			break;
		}
		var str = responseText.substr(this.offset_, nPos - this.offset_);
		str = str.replace(/\r$/, '');
		if(str.length > this.maxLength_) {
			this.failed_ = true;
			return [strings, cw.net.DecodeStatus.TOO_LONG];
		}
		strings.push(str);
		this.offset_ = nSearchPos = nPos + 1;
	}

	if(this.knownLength_ - this.offset_ - 1 > this.maxLength_) { // -1 to allow for \r
		this.failed_ = true;
		return [strings, cw.net.DecodeStatus.TOO_LONG];
	} else {
		return [strings, cw.net.DecodeStatus.OK];
	}
};
