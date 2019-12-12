import * as adaptiveSize from "./ui/adaptive-size.js"
import * as adaptiveDisplay from "./ui/adaptive-display.js"
import DisplayFlight from "./display-flight/display-flight.js"
import DisplayAirports from "./display-airports/display-airports.js"

function app() {
	const da = new DisplayAirports()
	const df = new DisplayFlight()
	adaptiveSize.init()
	adaptiveDisplay.init(da, df)
}

function init() {
	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", app)
	else
		app()
}

init()
