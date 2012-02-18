.. |debuntu| raw:: html

	<!-- expect dupe --><p class="debuntu">

.. |/debuntu| raw:: html

	</p><!-- expect dupe -->

.. |windows| raw:: html

	<!-- expect dupe --><p class="windows">

.. |/windows| raw:: html

	</p><!-- expect dupe -->

.. |switcher-controls| raw:: html

	<noscript><b class="jsproblem">Sorry, JavaScript is required to switch away from the Debian/Ubuntu instructions.</b><br></noscript>
	<b><span class="important">Important!</span> Show instructions for:</b><br>
	<form>
		<input type="radio" name="os" value="debuntu" id="os-debuntu" onclick="clickedSwitch();return true" checked>
			<label for="os-debuntu">Debian/Ubuntu</label>
		<input type="radio" name="os" value="windows" id="os-windows" onclick="clickedSwitch();return true">
			<label for="os-windows">Windows</label>
	</form>
	<p>
	(This setting changes the entire document.)
	</p>

.. |switcher-js| raw:: html

	<script src="jquery.min.js"></script>
	<script>
	var allOS = ["debuntu", "windows"];

	function switchInstructions(os) {
		$('.' + os).show();
		$.each(allOS, function(i, otherOS) {
			if(os != otherOS) {
				$('.' + otherOS).hide();
			}
		});
	}

	function getOS() {
		if($('#os-debuntu').prop('checked')) {
			return "debuntu";
		}
		return "windows";
	}

	function clickedSwitch() {
		switchInstructions(getOS());
	}

	$(document).ready(function() {
		clickedSwitch();
	});

	</script>
