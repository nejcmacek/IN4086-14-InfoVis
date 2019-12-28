import airports from "../data/airports.js"
import { airportsDisplaySettings as ads } from "../settings.js"
import InputControl from "../ui/input-control.js"
import { showAirportDelayPlot } from "../utils/misc.js"
import AirportControl from "./airport-control.js"
import AirportDelays from "./airport-delays.js"

function getAirportName(airport) {
	const splitterIndex = airport.name.indexOf("|")
	const fullName = splitterIndex < 0
		? airport.name
		: airport.name.substr(0, splitterIndex).trim()
	const name = `${fullName} (${airport.code})`
	return name
}

export default class DisplayAirports {

	/** @param {InputControl} inputControl */
	constructor(inputControl) {
		this.inputControl = inputControl
	}

	init() {
		/** @type {HTMLDivElement} */
		this.map = document.getElementById("airport-map")
		this.infoPanelAirport = document.getElementById("airport-info-panel-airport")
		this.infoPanelCityState = document.getElementById("airport-info-panel-city-state")
		this.infoPanelRunways = document.getElementById("airport-info-panel-runways")
		this.infoPanelDelay = document.getElementById("airport-info-panel-delay")
		this.plotHolder = document.getElementById("airport-plot-holder")
		this.plotLink = document.getElementById("airport-plot-link")

		// initialise airport map
		this.elements = []
		for (const a of airports) {
			const div = document.createElement("div")
			const ring = document.createElement("div")
			const marker = document.createElement("div")
			div.className = "airport-point"
			ring.className = "ring"
			marker.className = "marker"
			div.appendChild(ring)
			div.appendChild(marker)

			div.style.left = a.lat * 100 + "%"
			div.style.top = a.long * 100 + "%"
			this.map.appendChild(div)
			this.elements.push(div)
			a.element = div
			a.delay = NaN
			a.ring = ring
		}

		// add event listeners
		this.map.addEventListener("mousemove", e => this.onMouseMove(e))
		this.map.addEventListener("click", () => this.onClick())
		this.plotLink.addEventListener("click", e => this.onClickLink(e))
		this.inputControl.addEventListener("display-change", () => this.updatePlotLink())
		this.inputControl.addEventListener("value-change", () => this.updatePlotLink())

		// init processing data
		this.closestAirport = null // airport closes to the cursor
		this.focusedAirport = null // airport in focus

		// initialise airport components
		this.airportDelays = new AirportDelays()
		this.airportControl = new AirportControl(this.inputControl, this.airportDelays)
		this.airportControl.init()
		this.airportDelays.addEventListener(() => this.onCurrentDelayChange())
	}

	/** @param {MouseEvent} e */
	onClickLink(e) {
		e.preventDefault()

		const data = this.getPlotLinkData()
		if (!data)
			return

		if (this.inputControl.selectedTimeFrame === "single")
			showAirportDelayPlot(data.airport, data.time, data.time)
		else
			showAirportDelayPlot(data.airport, ...data.time)
	}

	getMouseEventMapCoords(e, mapBounds) {
		const height = this.map.clientHeight
		const width = this.map.clientWidth
		const x = (e.clientX - mapBounds.left) / width
		const y = (e.clientY - mapBounds.top) / height
		return { x, y }
	}

	/** @param {MouseEvent} e */
	onClick() {
		let hide = false

		if (this.focusedAirport && this.closestAirport) {
			const threshold = (ads.focusedAirportRange / 2) ** 2
			const height = this.map.clientHeight
			const width = this.map.clientWidth
			const dx = this.focusedAirport.lat - this.closestAirport.lat
			const dy = this.focusedAirport.long - this.closestAirport.long
			const dist = (dx * width) ** 2 + (dy * height) ** 2
			hide = dist <= threshold
		}

		this.setFocusedAirport(hide ? null : this.closestAirport)
	}

	/** @param {MouseEvent} e */
	onMouseMove(e) {
		const mapBounds = this.map.getBoundingClientRect()
		const { x, y } = this.getMouseEventMapCoords(e, mapBounds)

		const distances = airports.map(airport => ({
			airport,
			dist: (airport.lat - x) ** 2 + (airport.long - y) ** 2
		}));
		const closest = distances.reduce(
			(p, n) => p.dist < n.dist ? p : n,
			{ airport: null, dist: ads.minAirportCursorDistance }
		)

		this.setClosestAirport(closest.airport)
	}

	setClosestAirport(closest) {
		if (closest === this.closestAirport)
			return

		if (this.closestAirport)
			this.closestAirport.element.classList.remove("closest")
		if (closest)
			closest.element.classList.add("closest")

		this.closestAirport = closest

		if (!this.focusedAirport)
			this.updateAirportDetails()
	}

	setFocusedAirport(focused) {
		if (focused === this.focusedAirport)
			return

		if (this.focusedAirport)
			this.focusedAirport.element.classList.remove("focused")
		if (focused)
			focused.element.classList.add("focused")

		this.focusedAirport = focused
		this.updateAirportDetails()
	}

	updateAirportDetails() {
		const airport = this.getDisplayedAirport()
		if (airport) {
			this.infoPanelAirport.innerText = getAirportName(airport)
			this.infoPanelCityState.innerText = airport.city
			this.infoPanelRunways.innerText = airport.runways
			this.setInfoPanelDelayText(airport)
		} else {
			this.infoPanelAirport.innerText = ""
			this.infoPanelCityState.innerText = ""
			this.infoPanelRunways.innerText = ""
			this.infoPanelDelay.innerText = ""
		}
		this.updatePlotLink()
	}

	setInfoPanelDelayText(airport) {
		const delays = this.airportDelays.currentDelays
		if (delays)
			this.infoPanelDelay.innerText = Math.round(delays[airport.code]) + " minute(s)"
		else
			this.infoPanelDelay.innerText = ""
	}

	isPlotLinkEnabled() {
		return !!this.getDisplayedAirport()
			&& this.inputControl.isInitialised()
	}

	getPlotLinkData() {
		if (!this.isPlotLinkEnabled())
			return

		return {
			airport: this.getDisplayedAirport().code,
			time: this.inputControl.getValue(),
		}
	}

	updatePlotLink() {
		if (this.isPlotLinkEnabled())
			this.plotHolder.classList.remove("invisible")
		else
			this.plotHolder.classList.add("invisible")
	}

	/** @return {Airport | null} */
	getDisplayedAirport() {
		return this.focusedAirport || this.closestAirport || null
	}

	onCurrentDelayChange() {
		const airport = this.getDisplayedAirport()
		if (airport)
			this.setInfoPanelDelayText(airport)
	}

	activated() {
	}

	deactivated() {
		this.setClosestAirport(null)
		this.setFocusedAirport(null)
		this.airportControl.stop()
	}

}
