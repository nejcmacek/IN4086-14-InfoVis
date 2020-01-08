/** 
 * This file contains logic for switching between Airport Delay screen and the Flight Delay screen.
 * It finds all elements that need to be displayed/hidden and updates their visibility when required.
 */

import * as adaptiveSize from "./adaptive-size.js"


const inputSelect = document.getElementById("input-display-type")
let display
let displayAirports
let displayFlight

/** Shows the Airport Delay screen. */
export function showDisplayAirports() {
	display = "airports"
	for (const elt of document.getElementsByClassName("display-airports"))
		elt.classList.remove("hidden-display-panel")
	for (const elt of document.getElementsByClassName("display-flight"))
		elt.classList.add("hidden-display-panel")
}

/** Shows the Flight Delay screen. */
export function showDisplayFlight() {
	display = "flight"
	for (const elt of document.getElementsByClassName("display-flight"))
		elt.classList.remove("hidden-display-panel")
	for (const elt of document.getElementsByClassName("display-airports"))
		elt.classList.add("hidden-display-panel")
}

/** Handles the change of screens. */
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

/** Initialises the component. */
export function init(da, df) {
	displayAirports = da
	displayFlight = df

	inputSelect.addEventListener("change", onInputSelectChange)
	onInputSelectChange()
}
