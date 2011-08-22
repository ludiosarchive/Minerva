/**
 * @fileoverview Tests for cw/net/xdrtracker.js
 */

goog.provide('cw.net.TestXDRTracker');

goog.require('cw.UnitTest');
goog.require('goog.string');
goog.require('cw.net.XDRTracker');


// anti-clobbering for JScript; aliases
(function() {

/**
 * Tests for {@link cw.net.getDocumentDomain}
 */
cw.UnitTest.TestCase.subclass(cw.net.TestXDRTracker, 'XDRTrackerTests').methods(
	function test_getRandomSubdomain(self) {
		var re = RegExp("ml" + goog.string.repeat("\\d", 20));
		self.assertTrue(re.test(cw.net.getRandomSubdomain("ml")));
	},

	function test_getDocumentDomain(self) {
		self.assertEqual("zombo.com", cw.net.getDocumentDomain("zombo.com", "zombo.com"));
		self.assertEqual("zombo.com", cw.net.getDocumentDomain("zombo.com", "sub.zombo.com"));
		self.assertEqual("zombo.com", cw.net.getDocumentDomain("www.zombo.com", "sub.zombo.com"));
		self.assertEqual("zombo.com", cw.net.getDocumentDomain("www.zombo.com", "more.sub.zombo.com"));
		self.assertEqual("com", cw.net.getDocumentDomain("www.zombo.com", "notzombo.com"));
		self.assertEqual("", cw.net.getDocumentDomain("different.tld", "indeed.com"));
	},

	function test_getExpandedUrl(self) {
		var t = new cw.net.XDRTracker();
		self.assertEqual("http://zombo.com/", t.getExpandedUrl("http://zombo.com/"));

		var re = RegExp("http://ml" + goog.string.repeat("\\d", 20) + ".zombo.com/");
		self.assertTrue(re.test(t.getExpandedUrl("http://%random%.zombo.com/")));
	},

	function test_isUrlSuitable(self) {
		var t = new cw.net.XDRTracker();
		self.assertTrue(t.isUrlSuitable("http://zombo.com/", "http://zombo.com/"));
		self.assertTrue(t.isUrlSuitable("http://%random%.zombo.com/", "http://ml01234567890123456789.zombo.com/"));
		self.assertFalse(t.isUrlSuitable("http://%random%.zombo.com/", "nothttp://ml01234567890123456789.zombo.com/"));
		self.assertFalse(t.isUrlSuitable("http://%random%.zombo.com/", "nothttp://ml01234567890123456789.zombo.com/extra/"));
	}
);

})();
