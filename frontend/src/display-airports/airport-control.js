import InputControl from "../ui/input-control.js"
import Trackbar from "../ui/trackbar.js"
import { getDatesInBetween } from "../utils/date-string.js"
import EventListener from "../utils/event-listener.js"
import { countMonthsInBetween, getMonthsDisplayStringsInBetween, getMonthsInBetween } from "../utils/months.js"
import AirportDelays from "./airport-delays.js"

const hiddenClass = "hidden" // name of the CSS class that hides elements

/**
 * Airport control wires together the logic for handling the Airport Delay screen.
 */
export default class AirportControl extends EventListener {

	/**
	 * Creates a new instance.
	 * @param {InputControl} inputControl 
	 * @param {AirportDelays} airportDelays 
	 */
	constructor(inputControl, airportDelays) {
		super()
		/** @type {AirportDelays} */
		this.airportDelays = airportDelays
		/** @type {InputControl} */
		this.inputControl = inputControl
	}

	/** Initialises the component. */
	init() {
		// retrieve element references
		this.elementMonthRangeTrackbar = document.getElementById("airport-month-range-trackbar")
		this.elementDayRangeTrackbar = document.getElementById("airport-day-range-trackbar")

		// hide all unused elements
		this.elementDayRangeTrackbar.classList.add(hiddenClass)
		this.elementMonthRangeTrackbar.classList.add(hiddenClass)

		// manage trackbars
		this.trackbarMonthRange = new Trackbar(this.elementMonthRangeTrackbar, { playDelay: 500 })
		this.trackbarDayRange = new Trackbar(this.elementDayRangeTrackbar, { playDelay: 1000 / 3 })
		this.trackbarMonthRange.addEventListener(this.onChangeMonthTrackbar.bind(this))
		this.trackbarDayRange.addEventListener(this.onChangeDayTrackbar.bind(this))

		// hook to inputListener
		this.inputControl.addEventListener("display-change", this.onChangeDisplay.bind(this))
		this.inputControl.addEventListener("value-change", this.onChangeValue.bind(this))

		// private settings
		this.enabled = false
	}

	/** Called when the screen gets disabled. */
	disable() {
		this.enabled = false
	}

	/** Called when the screen ets enabled. */
	enable() {
		this.enabled = true
		const status = this.inputControl.getCurrentStatus()
		if (status)
			this.updateDisplay(status)
	}

	/** @param {DisplayChangeArgs} e */
	onChangeDisplay(e) {
		this.trackbarDayRange.setPlaying(false)
		this.trackbarMonthRange.setPlaying(false)
	}

	/** @param {ValueChangeArgs} status */
	onChangeValue(status) {
		this.updateDisplay(status)
	}

	/**
	 * Updates the screen when the user chooses a different display options. 
	 * @param {ValueChangeArgs} status
	 */
	updateDisplay(status) {
		const value = status.value
		if (!value)
			return

		switch (status.displayType) {
			case "day-single":
				this.declareDisplayDomain([value])
				this.displayDay(value)
				break
			case "day-range":
				this.updateDayTrackbar(value)
				break
			case "month-single":
				this.declareDisplayDomain([value])
				this.displayMonth(value)
				break
			case "month-range":
				this.updateMonthTrackbar(value)
				break
		}
	}

	/**
	 * Updates the month trackbar, when monthly input changes.
	 *  @param {string[] | null} value
	 */
	updateMonthTrackbar(value) {
		if (!value)
			return

		const [start, end] = value
		const steps = countMonthsInBetween(start, end)
		const items = getMonthsInBetween(start, end)
		const labels = getMonthsDisplayStringsInBetween(start, end)
		this.declareDisplayDomain(items)
		this.trackbarMonthRange.setOptions({ steps, items, labels, step: 0 })
		this.elementMonthRangeTrackbar.classList.remove("hidden")
	}

	/** Updates the displayed monthly delays, when the trackbar progress changes. */
	onChangeMonthTrackbar() {
		const item = this.trackbarMonthRange.getItem()
		this.displayMonth(item)
	}

	/** 
	 * Updates the displayed daily delays, when the trackbar progress changes.
	 * @param {string[] | null} value 
	 */
	updateDayTrackbar(value) {
		if (!value)
			return

		const [start, end] = value
		const between = getDatesInBetween(start, end)
		this.declareDisplayDomain(between)
		this.trackbarDayRange.setOptions({
			steps: between.length,
			items: between,
			labels: between,
			step: 0
		})
		this.elementDayRangeTrackbar.classList.remove("hidden")
	}

	onChangeDayTrackbar() {
		const item = this.trackbarDayRange.getItem()
		this.displayDay(item)
	}

	/**
	 * When range mode is selected, this method is called to preload delays
	 * of all airports for every time unit of the selected range.
	 */
	declareDisplayDomain(values) {
		this.airportDelays.declareDisplayDomain(values)
	}

	/** Forces the delay renderer to display delays for the given month. */
	displayMonth(value) {
		this.airportDelays.displayDate(value)
	}

	/** Forces the delay renderer to display delays for the given day. */
	displayDay(value) {
		this.airportDelays.displayDate(value)
	}

	stop() {
		this.trackbarDayRange.setPlaying(false)
		this.trackbarMonthRange.setPlaying(false)
	}

}	
