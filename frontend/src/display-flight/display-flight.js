import { getPlaneList } from "../data/rest-api.js"
import * as adaptiveSize from "../ui/adaptive-size.js"
import InputControl from "../ui/input-control.js"
import FlightControl from "./flight-control.js"
import FlightRenderer from "./renderer.js"

export default class DisplayFlight {

	/** @param {InputControl} inputControl */
	constructor(inputControl) {
		this.inputControl = inputControl
	}

	async init() {

		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById("flight-canvas")
		this.infoPanelAirline = document.getElementById("flight-info-panel-airline")
		this.infoPanelAircraft = document.getElementById("flight-info-panel-aircraft")
		this.infoPanelPassengers = document.getElementById("flight-info-panel-passengers")
		this.labelLoading = document.getElementById("flight-loading")
		this.labelNoFlights = document.getElementById("flight-label-empty")

		// load plane list
		this.labelLoading.classList.remove("hidden")
		this.planes = await getPlaneList()
		this.labelLoading.classList.add("hidden")

		// initialise underlying controls
		this.flightControl = new FlightControl(this.inputControl, this.planes)
		this.flightControl.init()
		this.renderer = new FlightRenderer(this.canvas)

		// attach listeners
		adaptiveSize.registerListener("flight-canvas", this.onResize.bind(this))
		this.flightControl.addEventListener("loading", this.onLoading.bind(this))
		this.flightControl.addEventListener("display-updated", this.onDisplayUpdated.bind(this))
		this.flightControl.addEventListener("flight-change", this.onFlightChange.bind(this))
	}

	onResize() {
		if (!this.flightControl.isInited())
			return

		if (this.flightControl.dynamics === "static") {
			this.renderer.renderStatic(this.flightControl.flights)
		} else {
			this.renderer.renderDynamic(this.flightControl.drawData, true, this.flightControl.flights.length)
		}
	}

	onLoading() {
		this.infoPanelAircraft.innerText = "(loading...)"
		this.infoPanelAirline.innerText = "(loading...)"
		this.infoPanelPassengers.innerText = "(loading...)"
		this.labelLoading.classList.remove("hidden")
		// stop all rendering
	}
	onDisplayUpdated() {
		this.labelLoading.classList.add("hidden")

		if (!this.flightControl.isInited()) {
			this.infoPanelAircraft.innerText = ""
			this.infoPanelAirline.innerText = ""
			this.infoPanelPassengers.innerText = ""
			this.renderer.clearCanvas()
			return
		}

		this.infoPanelAircraft.innerText = this.flightControl.planeData.model
		this.infoPanelAirline.innerText = this.flightControl.planeData.carrier
		this.infoPanelPassengers.innerText = this.flightControl.planeData.passengers

		if (!this.flightControl.hasContent()) {
			this.labelNoFlights.classList.remove("hidden")
			this.renderer.clearCanvas()
			return
		}

		this.labelNoFlights.classList.add("hidden")
		if (this.flightControl.dynamics === "static")
			this.renderer.renderStatic(this.flightControl.flights)
		// else { this.onFlightChange will be triggered and render flights } 
	}

	/** @param {PlaneDrawData} drawData */
	onFlightChange(drawData) {
		this.renderer.renderDynamic(drawData, false, this.flightControl.flights.length)
	}

	activated() {
	}

	deactivated() {
		this.renderer.stopRendering()
		this.flightControl.stop()
	}

}
