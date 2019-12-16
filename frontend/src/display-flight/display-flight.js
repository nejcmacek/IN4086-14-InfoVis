import airlines from '../data/airlines.js'
import { getFlightHistory, getPlaneList } from '../data/rest-api.js'

export default class DisplayFlight {

	async init() {
		/** @type {HTMLSelectElement} */
		const inputPlaneSelect = document.getElementById("input-plane")
		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById("flight-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.infoPanelAirline = document.getElementById("flight-info-panel-airline")
		this.infoPanelAircraft = document.getElementById("flight-info-panel-aircraft")
		this.infoPanelPassengers = document.getElementById("flight-info-panel-passengers")

		this.planes = await getPlaneList()
		inputPlaneSelect.children[0].remove() // the loading tag
		for (const plane of this.planes) {
			const option = document.createElement("option")
			option.value = plane
			option.text = plane
			inputPlaneSelect.appendChild(option)
		}
		inputPlaneSelect.addEventListener("change", e => this.displayFlight(e.target.value))

		/** @type {{[key: string]: FlightHistory}} */
		this.flightData = {}
	}

	async displayFlight(flight) {
		if (!flight) {
			this.infoPanelAirline.innerText = ""
			this.infoPanelAircraft.innerText = ""
			this.infoPanelPassengers.innerText = ""
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			return
		}

		// retrieve the data
		let data;
		if (flight in this.flightData) {
			// we already have the data cached
			data = this.flightData[flight]
		} else {
			// notify the user that we're loading the data
			this.infoPanelAirline = data.op_carrier || "(loading...)"
			this.infoPanelAircraft = data.model || "(loading...)"
			this.infoPanelPassengers = data.passengers || "(loading...)"

			// load the data
			data = await getFlightHistory(flight)
			this.flightData[flight] = data // cache the data
		}

		// update display
		this.infoPanelAirline = data.op_carrier && airlines[data.op_carrier] || "(unknown)"
		this.infoPanelAircraft = data.model || "(unknown)"
		this.infoPanelPassengers = data.passengers || "(unknown)"

		this.renderFlightData()
	}

	/** @param {FlightHistory} data */
	renderFlightData(data) {
		this.ctx.fillText("Ha Ha Ha.. Ho ho... hue hue hue..", 0, 0, this.canvas.width)
	}

	activated() {
	}

	deactivated() {
		this.displayFlight(null)
	}

}
