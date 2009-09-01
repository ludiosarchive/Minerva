/**
 * Tests for the CW.Net
 */


// import CW.UnitTest
// import CW.Net


CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'TestResponseTextDecoder').methods(

	function test_decoder(self) {
		var Eater = CW.Class.subclass('Eater');

		Eater.methods(
			function __init__(self, foodFactory) {
				self.food = foodFactory();
			},

			function doEat(self) {
				return self.food + 1;
			}
		);
	}
);
