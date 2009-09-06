from twisted.application.service import ServiceMaker

TwistedWeb = ServiceMaker(
	"Minerva test server",
	"minerva.tap",
	"Minerva test server",
	"minervarun"
)
