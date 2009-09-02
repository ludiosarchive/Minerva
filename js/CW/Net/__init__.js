// import CW

CW.Error.subclass(CW.Net, 'ParseError');


/**
 * A decoder that extracts frames from an object with an L{responseText}.
 * The decoder must be "pushed" by using L{receivedToByte}.
 *
 * L{responseText} is assumed to have unicode/byte equivalence.
 * No non-ASCII characters are allowed, because of our optimizations,
 * and because of browser bugs.
 */
CW.Class.subclass(CW.Net, "ResponseTextDecoder").methods(
	/**
	 * L{xObject} is an L{XMLHttpRequest} or L{XDomainRequest} object
	 * or any object with a unicode C{responseText} property.
	 */
	function __init__(self, xObject, MAX_LENGTH) {
		// TODO: as an ugly optimization, mode and readLength could be combined.
		self._offset = 0;
		self._ignoreUntil = 1;
		self._mode = 0; // 0 means LENGTH, 1 means DATA
		self._readLength = null;
		self.xObject = xObject;
		if(!MAX_LENGTH) {
			MAX_LENGTH = 1024*1024*1024;
		}
		self.setMaxLength(MAX_LENGTH);
	},

	function setMaxLength(self, MAX_LENGTH) {
		self.MAX_LENGTH = MAX_LENGTH;
		self.MAX_LENGTH_LEN = (''+MAX_LENGTH).length;
	},

	/**
	 * Check for new data in L{xObject} and return an array of new frames.
	 * If possible, provide a number L{responseTextLength} if you know
	 * how many bytes are available in L{responseText} (but do not look at the
	 * property responseText or responseText.length yourself). Passing a too-low
	 * L{responseTextLength} will not break the decoder, as long as you call it later
	 * with a higher number. Pass C{null} for L{responseTextLength} if you do not know
	 * how many bytes are in L{responseText}.
	 *
	 * Passing a number for L{responseTextLength} helps avoid unnecessary
	 * property lookups of L{responseText}, which increases performance
	 * in Firefox, and potentially other browsers.
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
			if(self._mode === 0) { // mode LENGTH
				var colon = text.indexOf(':', self._offset);
				if(colon === -1) {
					if(responseTextLength - self._offset > self.MAX_LENGTH_LEN) {
						throw new CW.Net.ParseError("length too long");
					}
					// There's not even a colon yet? Break.
					////console.log('No colon yet. Break.')
					break;
					// Unlike minerva._protocols, don't eager-fail if there are
					// non-digits; it's a waste of CPU time.
				}

				var readLength = parseInt(text.substr(self._offset, colon-self._offset), 10);
				////console.log('Extracted readLength', readLength);
				// This isn't complete error-checking, because
				// parseInt("123garbage456", 10) == 123, but it's good enough.
				if(isNaN(readLength)) {
					throw new CW.Net.ParseError("obviously corrupt length");
				}
				if(readLength > self.MAX_LENGTH) {
					throw new CW.Net.ParseError("length too long");
				}
				self._readLength = readLength;
				self._offset += (''+readLength).length + 1; // + 1 to skip over the ":"
				self._mode = 1;
			} else { // mode DATA
				if(self._offset + self._readLength > responseTextLength) {
					////console.log('Not enough data bytes yet. Break.');
					break;
				}
				var s = text.substr(self._offset, self._readLength);
				self._offset += self._readLength;
				//self._readLength = null; // reseting this is optional
				self._mode = 0;
				strings.push(s);
			}
		}
		if(self._mode === 0) {
			// Can't ignore anything when still receiving the length
			self._ignoreUntil = responseTextLength + 1;
		} else {
			self._ignoreUntil = self._offset + self._readLength;
		}
		////console.log('_ignoreUntil now', self._ignoreUntil);
		return strings;
	}
);
