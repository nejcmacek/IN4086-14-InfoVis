import * as adaptiveSize from "./ui/adaptive-size.js"
import * as adaptiveDisplay from "./ui/adaptive-display.js"
import DisplayFlight from "./display-flight/display-flight.js"
import DisplayAirports from "./display-airports/display-airports.js"
import { waitLoading } from "./data/rest-api.js"
import { waitTimeout } from "./utils/misc.js"

function errorHandler() {
	document.getElementById("overlay-error").classList.remove("hidden")
}

async function app() {
	await waitLoading()
	const da = new DisplayAirports()
	const df = new DisplayFlight()
	adaptiveSize.init()
	adaptiveDisplay.init(da, df)
	await waitTimeout(50) // wait for UI to initialise
	document.getElementById("overlay-loading").remove()
}

function init() {
	// TODO: revert select option to airport delay
	// window.addEventListener("error", errorHandler)
	// window.addEventListener("unhandledrejection", errorHandler)
	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", app)
	else
		app()
}

init()
