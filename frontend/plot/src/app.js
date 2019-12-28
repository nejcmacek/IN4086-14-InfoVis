import { getUrlParameters, loadData } from "./data.js"
import Display from "./display.js"
import "./lib/d3.min.js"

function errorHandler() {
	document.getElementById("overlay-error").classList.remove("hidden")
}

/** 
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

function init() {
	const params = getUrlParameters()
	const dataPromise = loadData(params) // start loading the data
	const callback = () => app(params, dataPromise)

	window.addEventListener("error", errorHandler)
	window.addEventListener("unhandledrejection", errorHandler)

	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", callback)
	else
		callback()
}

init()
