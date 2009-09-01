// import CW

/**
 * A decoder that extracts frames from an object with an L{responseText}.
 * The decoder must be "pushed" by using L{receivedToByte}.
 *
 * L{responseText} is assumed to have unicode/byte equivalence.
 * No non-ASCII characters are allowed, because of our optimizations,
 * and because of browser bugs.
 */
CW.Class.subclass(CW.Net.ResponseTextDecoder).methods(
	/**
	 * L{xObject} is an L{XMLHttpRequest} or L{XDomainRequest} object
	 * or any object with a unicode C{responseText} property.
	 */
	function __init__(self, xObject) {
		self.ignoringUntil = 0;
		self.xObject = xObject;
		self.MAX_LENGTH = 1024*1024*1024;
	},

	/**
	 * Check for new data in L{xObject} and return an array
	 * of new frames. Please provide a number L{byte} if you know
	 * how many bytes are available in L{responseText}. Passing a
	 * too-low number will not break the decoder. Pass C{null} for
	 * L{byte} if you do not know how many bytes have been received.
	 *
	 * Passing a number for L{byte} will help avoid unnecessary
	 * property lookups of L{responseText}, which increases performance
	 * in Firefox, and potentially other browsers.
	 */
	function receivedToByte(self, byte) {
		if(byte === null || byte >= self.ignoringUntil) {
			var text = self.xObject.responseText;
			for(;;) {
				var colon = self.xObject.
			}
		}
	}
);
