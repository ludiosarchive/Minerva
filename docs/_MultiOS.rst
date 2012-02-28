.. role:: small
	:class: small

.. role:: debuntu
	:class: debuntu

.. role:: windows
	:class: windows

.. |substep| raw:: html

	<div class="substep">

.. |/substep| raw:: html

	</div><!-- class="substep" -->

.. |p-debuntu| raw:: html

	<!-- expect dupe --><p class="debuntu">

.. |/p-debuntu| raw:: html

	</p><!-- expect dupe -->

.. |p-windows| raw:: html

	<!-- expect dupe --><p class="windows">

.. |/p-windows| raw:: html

	</p><!-- expect dupe -->

.. |span-debuntu| raw:: html

	<span class="debuntu">

.. |/span-debuntu| raw:: html

	</span>

.. |span-windows| raw:: html

	<span class="windows">

.. |/span-windows| raw:: html

	</span>

.. |div-debuntu| raw:: html

	<div class="debuntu">

.. |/div-debuntu| raw:: html

	</div>

.. |div-windows| raw:: html

	<div class="windows">

.. |/div-windows| raw:: html

	</div>

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
