import * as adaptiveSize from "./adaptive-size.js"

const inputSelect = document.getElementById("input-display-type")
let display
let displayAirports
let displayFlight

export function showDisplayAirports() {
	display = "airports"
	for (const elt of document.getElementsByClassName("display-airports"))
		elt.classList.remove("hidden")
	for (const elt of document.getElementsByClassName("display-flight"))
		elt.classList.add("hidden")
}

export function showDisplayFlight() {
	display = "flight"
	for (const elt of document.getElementsByClassName("display-flight"))
		elt.classList.remove("hidden")
	for (const elt of document.getElementsByClassName("display-airports"))
		elt.classList.add("hidden")
}

function onInputSelectChange() {
	if (inputSelect.value === "airports") {
		showDisplayAirports()
		displayFlight.deactivated()
		displayAirports.activated()
	} else {
		showDisplayFlight()
		displayAirports.deactivated()
		displayFlight.activated()
	}

	adaptiveSize.rescale()
}

export function init(da, df) {
	displayAirports = da
	displayFlight = df

	inputSelect.addEventListener("change", onInputSelectChange)
	onInputSelectChange()
}
