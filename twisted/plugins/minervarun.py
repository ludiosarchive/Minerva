from twisted.application.service import ServiceMaker

MinervaRun = ServiceMaker(
	"Minerva test server",
	"minerva.tap",
	"Minerva test server",
	"minervarun"
)
