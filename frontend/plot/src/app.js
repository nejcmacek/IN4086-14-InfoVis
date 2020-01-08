import { getUrlParameters, loadData } from "./data.js"
import Display from "./display.js"
import "./lib/d3.min.js"

/** Called if an uncaught error occurs. */
function errorHandler() {
	document.getElementById("overlay-error").classList.remove("hidden")
}

/** 
 * Runs the core application.
 * @param {URLParams} params
 * @param {Promise<AirportDelayTypes[]>} dataPromise
*/
async function app(params, dataPromise) {
	const data = await dataPromise // wait until data is loaded

	// set display
	const display = new Display(params, data)
	display.init()

	document.getElementById("overlay-loading").remove() // remove the loading overlay
}

/** Initialises the website: binds even listeners, gets the data, calls app() when the page loads. */
function init() {
	const params = getUrlParameters() // valuable information is encoded in the URL
	const dataPromise = loadData(params) // start loading the data
	const callback = () => app(params, dataPromise)

	// set error handlers
	window.addEventListener("error", errorHandler)
	window.addEventListener("unhandledrejection", errorHandler)

	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", callback)
	else
		callback()
}

init() // start everything
