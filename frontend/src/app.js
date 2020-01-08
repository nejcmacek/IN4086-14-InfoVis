/** 
 * This file is the main entry point of the application.
 * It initialises the whole UI and applications.
 */

import { waitLoading } from "./data/rest-api.js"
import DisplayAirports from "./display-airports/display-airports.js"
import DisplayFlight from "./display-flight/display-flight.js"
import * as adaptiveDisplay from "./ui/adaptive-display.js"
import * as adaptiveSize from "./ui/adaptive-size.js"
import InputControl from "./ui/input-control.js"
import { waitTimeout } from "./utils/misc.js"

/** Called if an uncaught error occurs. */
function errorHandler() {
	document.getElementById("overlay-error").classList.remove("hidden")
}

/**
 * Runs the core application.
 */
async function app() {
	await waitLoading()

	adaptiveSize.init()
	// create controls
	const ic = new InputControl()
	const da = new DisplayAirports(ic)
	const df = new DisplayFlight(ic)
	ic.init()
	da.init()
	await df.init()

	// attach global hooks
	adaptiveDisplay.init(da, df)

	await waitTimeout(50) // wait for UI to initialise
	document.getElementById("overlay-loading").remove() // remove the loading overlay
}

/** Initialises the website: binds even listeners and calls the app() function. */
function init() {
	window.addEventListener("error", errorHandler)
	window.addEventListener("unhandledrejection", errorHandler)
	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", app)
	else
		app()
}

init() // start everything
