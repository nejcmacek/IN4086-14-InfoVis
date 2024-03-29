import { getPlaneList } from "../data/rest-api.js"
import * as adaptiveSize from "../ui/adaptive-size.js"
import InputControl from "../ui/input-control.js"
import FlightControl from "./flight-control.js"
import FlightRenderer from "./renderer.js"

/** Wires together the mains aspects of the Flight Delay screen. */
export default class DisplayFlight {

	/** @param {InputControl} inputControl */
	constructor(inputControl) {
		this.inputControl = inputControl
	}

	/** Initialises the component. */
	async init() {

		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById("flight-canvas")
		this.infoPanelAirline = document.getElementById("flight-info-panel-airline")
		this.infoPanelAircraft = document.getElementById("flight-info-panel-aircraft")
		this.infoPanelPassengers = document.getElementById("flight-info-panel-passengers")
		this.infoPanelDelayHolder = document.getElementById("flight-info-panel-delay-holder")
		this.infoPanelDelay = document.getElementById("flight-info-panel-delay")
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

	/** Handles window resize */
	onResize() {
		if (!this.flightControl.isInited())
			return

		if (this.flightControl.dynamics === "static") {
			this.renderer.renderStatic(this.flightControl.flights)
		} else {
			this.renderer.renderDynamic(this.flightControl.drawData, true, this.flightControl.flights.length)
		}
	}

	/** Fired when data starts loading. */
	onLoading() {
		this.infoPanelAircraft.innerText = "(loading...)"
		this.infoPanelAirline.innerText = "(loading...)"
		this.infoPanelPassengers.innerText = "(loading...)"
		this.labelLoading.classList.remove("hidden")
	}

	/** Called when input settings changes. Updates the screen accordingly. */
	onDisplayUpdated() {
		this.labelLoading.classList.add("hidden")

		if (!this.flightControl.isInited()) {
			this.infoPanelAircraft.innerText = ""
			this.infoPanelAirline.innerText = ""
			this.infoPanelPassengers.innerText = ""
			this.infoPanelDelayHolder.classList.add("invisible")
			this.renderer.clearCanvas()
			return
		}

		this.infoPanelAircraft.innerText = this.flightControl.planeData.model
		this.infoPanelAirline.innerText = this.flightControl.planeData.carrier
		this.infoPanelPassengers.innerText = this.flightControl.planeData.passengers

		if (!this.flightControl.hasContent()) {
			this.labelNoFlights.classList.remove("hidden")
			this.infoPanelDelayHolder.classList.add("invisible")
			this.renderer.clearCanvas()
			return
		}

		this.labelNoFlights.classList.add("hidden")
		if (this.flightControl.dynamics === "static") {
			this.renderer.renderStatic(this.flightControl.flights)
			this.infoPanelDelayHolder.classList.add("invisible")
		} else {
			this.infoPanelDelayHolder.classList.remove("invisible")
			// this.onFlightChange will be triggered and render flights
		}

	}

	/** Called when the selected plane changes.
	 * @param {PlaneDrawData} drawData 
	 */
	onFlightChange(drawData) {
		this.renderer.renderDynamic(drawData, false, this.flightControl.flights.length)
		this.infoPanelDelay.innerText = drawData.current.arrivalDelay + " min"
	}

	activated() {
	}

	deactivated() {
		this.renderer.stopRendering()
		this.flightControl.stop()
	}

}
