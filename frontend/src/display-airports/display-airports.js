import airports from "../data/airports.js"
import InputControl from "./input-control.js"

const minAirportCursorDistance = 8
const focusedAirportRange = 48


function getAirportName(airport) {
	const splitterIndex = airport.name.indexOf("|")
	const fullName = splitterIndex < 0
		? airport.name
		: airport.name.substr(0, splitterIndex).trim()
	const name = `${fullName} (${airport.code})`
	return name
}


export default class DisplayAirports {

	init() {
		this.infoPanelAirport = document.getElementById("airport-info-panel-airport")
		this.infoPanelCityState = document.getElementById("airport-info-panel-city-state")
		this.infoPanelRunways = document.getElementById("airport-info-panel-runways")

		/** @type {HTMLDivElement} */
		this.map = document.getElementById("airport-map")
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
		}

		this.captureMapBounds()
		window.addEventListener("resize", () => this.captureMapBounds())
		this.map.addEventListener("mousemove", e => this.onMouseMove(e))
		this.map.addEventListener("click", () => this.onClick())
		this.closestAirport = null // airport closes to the cursor
		this.focusedAirport = null // airport in focus

		this.inputControl = new InputControl()
		this.inputControl.init()
	}

	getMouseEventMapCoords(e) {
		const height = this.map.clientHeight
		const width = this.map.clientWidth
		const x = (e.clientX - this.mapBounds.left) / width
		const y = (e.clientY - this.mapBounds.top) / height
		return { x, y }
	}

	/** @param {MouseEvent} e */
	onClick() {
		let hide = false

		if (this.focusedAirport && this.closestAirport) {
			const threshold = (focusedAirportRange / 2) ** 2
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
		const { x, y } = this.getMouseEventMapCoords(e)

		const distances = airports.map(airport => ({
			airport,
			dist: (airport.lat - x) ** 2 + (airport.long - y) ** 2
		}));
		const closest = distances.reduce(
			(p, n) => p.dist < n.dist ? p : n,
			{ airport: null, dist: minAirportCursorDistance }
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
			this.setAirportDetails(closest)
	}

	setFocusedAirport(focused) {
		if (focused === this.focusedAirport)
			return

		if (this.focusedAirport)
			this.focusedAirport.element.classList.remove("focused")
		if (focused)
			focused.element.classList.add("focused")

		this.focusedAirport = focused
		this.setAirportDetails(focused)
	}

	setAirportDetails(airport) {
		if (airport) {
			this.infoPanelAirport.innerText = getAirportName(airport)
			this.infoPanelCityState.innerText = airport.city
			this.infoPanelRunways.innerText = airport.runways
		} else {
			this.infoPanelAirport.innerText = ""
			this.infoPanelCityState.innerText = ""
			this.infoPanelRunways.innerText = ""
		}
	}

	captureMapBounds() {
		this.mapBounds = this.map.getBoundingClientRect()
	}

	activated() {
	}

	deactivated() {
		this.setClosestAirport(null)
		this.setFocusedAirport(null)
	}

}
