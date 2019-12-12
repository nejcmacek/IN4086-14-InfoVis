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
	const value = inputSelect.value
	if (value === "airports") {
		showDisplayAirports()
		displayFlight.deactivated()
		displayAirports.activated()
	} else {
		showDisplayFlight()
		displayAirports.deactivated()
		displayFlight.activated()
	}
}

export function init(da, df) {
	displayAirports = da
	displayFlight = df
	displayAirports.init()
	displayFlight.init()

	inputSelect.addEventListener("change", onInputSelectChange)
	showDisplayAirports()

	displayAirports.activated()
}
