import airports from "./data/airports.js"
import * as adaptiveSize from "./ui/adaptive-size.js"
import * as airportMap from "./ui/airport-map.js"

function app() {
	airportMap.init()
	adaptiveSize.init()
}

function init() {
	if (document.readyState !== "loading")
		document.addEventListener("DOMContentLoaded", app)
	else
		app()
}

init()
