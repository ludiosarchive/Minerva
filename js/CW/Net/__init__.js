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
	 * Check for new data in L{xObject} and return an array
	 * of new frames. Please provide a number L{responseTextBytes} if you know
	 * how many bytes are available in L{responseText}. Passing a
	 * too-low number will not break the decoder. Pass C{null} for
	 * L{responseTextBytes} if you do not know how many bytes have been received.
	 *
	 * Passing a number for L{responseTextBytes} will help avoid unnecessary
	 * property lookups of L{responseText}, which increases performance
	 * in Firefox, and potentially other browsers.
	 */
	function receivedToByte(self, responseTextBytes) {
		// responseTextBytes has to be greater than self._offset;
		// for example: if _offset is 0, at responseTextBytes must be > 0 for something
		// to happen.
		if(!(responseTextBytes === null || responseTextBytes > self._offset)) {
			// There certainly isn't enough data in L{responseText} yet, so return.
			return [];
		}

		var text = self.xObject.responseText;
		if(responseTextBytes === null) {
			responseTextBytes = text.length;
		}
		var strings = [];
		for(;;) {
			if(self._mode === 0) { // mode LENGTH
				var colon = text.indexOf(':', self._offset);
				if(colon === -1) {
					if(responseTextBytes - self._offset > self.MAX_LENGTH_LEN) {
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
				if(self._offset + self._readLength > responseTextBytes) {
					////console.log('Not enough data bytes yet. Break.');
					break;
				}
				var s = text.substr(self._offset, self._readLength);
				self._offset += self._readLength;
				//self._readLength = null; // this is optional
				self._mode = 0;
				strings.push(s);
			}
		}
		return strings;
	}
);
