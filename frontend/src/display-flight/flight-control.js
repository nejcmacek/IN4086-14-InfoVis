import { flightDisplaySettings as fds } from "../settings.js"
import InputControl from "../ui/input-control.js"
import Trackbar from "../ui/trackbar.js"
import { getDatesInBetween } from "../utils/date-string.js"
import EventListener from "../utils/event-listener.js"
import { firstDayOfMonth, lastDayOfMonth } from "../utils/months.js"
import DataManager from "./data-manager.js"

/** Handles the input of the Flight Delay screen. */
export default class FlightControl extends EventListener {

	/** @param {InputControl} inputControl */
	constructor(inputControl, planes) {
		super()
		this.inputControl = inputControl
		this.planes = planes
		this.dataManager = new DataManager()
	}

	/** Initialises the component. */
	init() {
		/** @type {HTMLSelectElement} */
		this.inputPlaneSelect = document.getElementById("input-plane")
		this.elementTrackbar = document.getElementById("flight-trackbar")
		this.elementTrackbarHolder = document.getElementById("flight-trackbar-holder")
		this.inputDynamicsStatic = document.getElementById("flight-dynamics-static")
		this.inputDynamicsDynamic = document.getElementById("flight-dynamics-dynamic")

		// create the trackbar
		this.trackbar = new Trackbar(this.elementTrackbar, { playDelay: fds.flightHistoryPlayDelay })
		this.trackbar.addEventListener(() => this.onChangeTrackbar())

		// attach even listeners
		this.inputControl.addEventListener("display-change", this.onChangeDisplay.bind(this))
		this.inputControl.addEventListener("value-change", this.onChangeValue.bind(this))

		// populate the plane select input field
		this.inputPlaneSelect.children[0].remove() // the loading tag
		for (const plane of this.planes) {
			const option = document.createElement("option")
			option.value = plane
			option.text = plane
			this.inputPlaneSelect.appendChild(option)
		}
		this.inputPlaneSelect.value = ""

		// attach more event listeners
		this.inputPlaneSelect.addEventListener("change", e => this.onChangePlane(e.target.value))
		this.inputDynamicsStatic.addEventListener("change", () => this.onChangeDynamics())
		this.inputDynamicsDynamic.addEventListener("change", () => this.onChangeDynamics())

		// set input fields
		/** @type {DisplayDynamics} */
		this.dynamics = this.inputDynamicsStatic.checked ? "static" : "dynamic"
		this.start = null
		this.end = null
		this.tailNum = null

		// displayed data
		/** @type {PlaneData} */
		this.planeData = null
		/** @type {Flight[]} */
		this.flights = null
		/** @type {PlaneDrawData} */
		this.drawData = null

		// data retrieval status
		this.hash = 0
		this.loading = false
	}

	/** Checks if all the input fields are initialised. */
	isInited() {
		return this.inputControl.isInitialised() && !!this.start && !!this.end && !!this.tailNum
	}

	/** Check is all the input fields are initialised and some flights are available on the selected dates. */
	hasContent() {
		return this.isInited() && this.flights.length > 0
	}

	/** Called when the dynamics setting changes. */
	onChangeDynamics() {
		if (this.inputDynamicsStatic.checked) {
			this.elementTrackbarHolder.classList.add("hidden")
			this.trackbar.setPlaying(false)
			this.dynamics = "static"
		} else {
			this.elementTrackbarHolder.classList.remove("hidden")
			this.dynamics = "dynamic"
		}

		this.updateDisplay()
	}

	/** Fired when the selected plane changes. */
	onChangePlane(tailNum) {
		this.tailNum = tailNum || null
		this.updateDisplay()
	}

	/**
	 * Fired when the display settings change (time unit or time frame). 
	 * @param {DisplayChangeArgs} e 
	 */
	onChangeDisplay(e) {
		this.trackbar.setPlaying(false)
		this.updateDisplay()
	}

	/** Called when trackbar progress changes. Updates the screen UI accordingly.
	 * @param {ValueChangeArgs} status 
	 */
	onChangeValue(status) {
		const value = status.value
		if (!value)
			return

		switch (status.displayType) {
			case "day-single":
				this.start = value
				this.end = value
				break
			case "day-range":
				this.start = value[0]
				this.end = value[1]
				break
			case "month-single":
				this.start = firstDayOfMonth(value)
				this.end = lastDayOfMonth(value)
				break
			case "month-range":
				this.start = firstDayOfMonth(value[0])
				this.end = lastDayOfMonth(value[1])
				break
			default:
				throw new Error("Unrecognised Display Type.")
		}

		this.updateDisplay()
	}

	/** 
	 * Prepares data that will be used for rendering the plane flight paths.
	 * @returns {PlaneDrawData} 
	 */
	createPlaneDrawData() {
		if (this.dynamics === "static")
			throw new Error("Invalid Display Type.")

		/** @type {Flight} */
		const item = this.trackbar.getItem()
		const step = this.trackbar.step

		const history = []
		for (let i = step - 1; i >= 0 && history.length < fds.dynamicDisplayHistorySize; i--)
			history.push(this.flights[i])

		return {
			current: item,
			time: fds.flightHistoryPlayDelay,
			history,
		}
	}

	/** Fired when the trackbar settings change. */
	onChangeTrackbar() {
		this.drawData = this.createPlaneDrawData()
		this.emit("flight-change", this.drawData)
	}

	/** Updates the screen given. Display "loading" if loading, otherwise updates the trackbar and displayed labels. */
	async updateDisplay() {
		this.trackbar.setPlaying(false)

		if (!this.isInited()) {
			this.flights = null
			this.drawData = null
			this.planeData = null
			this.loading = false
			this.hash++
			this.elementTrackbarHolder.classList.add("hidden")
			this.emit("display-updated")
			return
		}

		/** @type {PlaneData} */
		let data

		if (this.dataManager.isLoaded(this.tailNum)) {
			data = this.dataManager.getLoadedFlightData(this.tailNum)
		} else {
			this.loading = true
			const hash = ++this.hash
			this.elementTrackbarHolder.classList.add("hidden")
			this.emit("loading", null)
			data = await this.dataManager.loadFlightData(this.tailNum)
			if (this.hash !== hash) // the user might have selected a new flight by the time this one has loaded
				return
		}

		this.loading = false
		this.drawData = null
		this.planeData = data
		this.flights = getDatesInBetween(this.start, this.end)
			.flatMap(t => data.schedule[t])

		if (this.dynamics === "static") {
			this.emit("display-updated")
		} else {
			// hide trackbar if no results (trackbar cannot take 0 items)
			if (!this.flights.length) {
				this.elementTrackbarHolder.classList.add("hidden")
				this.emit("display-updated")
				return
			}

			// update the trackbar
			this.elementTrackbarHolder.classList.remove("hidden")
			const labels = this.flights.map(t => {
				const time = t.departureTime.toString().padStart(4, "0")
				return `${t.date} | ${time.substr(0, 2)}:${time.substr(2, 2)}`
			})

			this.emit("display-updated")

			this.trackbar.setOptions({
				items: this.flights,
				labels,
				steps: this.flights.length,
				step: 0,
			})
		}
	}

	stop() {
		this.trackbar.setPlaying(false)
	}

}
