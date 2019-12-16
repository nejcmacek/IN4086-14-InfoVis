import { compareDateStrings, getDatesInBetween } from "../utils/date-string.js"
import { compareMonths, getMonthDisplayString, monthValues, getMonthsInBetween, getMonthsDisplayStringsInBetween, countMonthsInBetween } from "../utils/months.js"
import Trackbar from "../ui/trackbar.js"

const hiddenClass = "hidden"

export default class InputControl {

	init() {
		// retrieve element references
		this.inputUnitTimeDay = document.getElementById("airport-unit-time-day")
		this.inputUnitTimeMonth = document.getElementById("airport-unit-time-month")
		this.inputFrameTimeSingle = document.getElementById("airport-frame-time-single")
		this.inputFrameTimeRange = document.getElementById("airport-frame-time-range")
		this.inputMonthSingle = document.getElementById("airport-input-field-month-single")
		this.inputMonthRangeStart = document.getElementById("airport-input-field-month-range-start")
		this.inputMonthRangeEnd = document.getElementById("airport-input-field-month-range-end")
		this.inputDaySingle = document.getElementById("airport-input-field-day-single")
		this.inputDayRangeStart = document.getElementById("airport-input-field-day-range-start")
		this.inputDayRangeEnd = document.getElementById("airport-input-field-day-range-end")
		this.elementMonth = document.getElementById("airport-input-control-month")
		this.elementMonthSingle = document.getElementById("airport-input-control-month-single")
		this.elementMonthRange = document.getElementById("airport-input-control-month-range")
		this.elementMonthRangeTrackbar = document.getElementById("airport-month-range-trackbar")
		this.elementDay = document.getElementById("airport-input-control-day")
		this.elementDaySingle = document.getElementById("airport-input-control-day-single")
		this.elementDayRange = document.getElementById("airport-input-control-day-range")
		this.elementDayRangeTrackbar = document.getElementById("airport-day-range-trackbar")

		// add handlers
		this.inputUnitTimeDay.addEventListener("change", this.onChangeTimeUnit.bind(this))
		this.inputUnitTimeMonth.addEventListener("change", this.onChangeTimeUnit.bind(this))
		this.inputFrameTimeSingle.addEventListener("change", this.onChangeTimeFrame.bind(this))
		this.inputFrameTimeRange.addEventListener("change", this.onChangeTimeFrame.bind(this))
		this.inputMonthSingle.addEventListener("change", this.onChangeMonthSingle.bind(this))
		this.inputMonthRangeStart.addEventListener("change", this.onChangeMonthRangeStart.bind(this))
		this.inputMonthRangeEnd.addEventListener("change", this.onChangeMonthRangeEnd.bind(this))
		this.inputDaySingle.addEventListener("change", this.onChangeDaySingle.bind(this))
		this.inputDayRangeStart.addEventListener("change", this.onChangeDayRangeStart.bind(this))
		this.inputDayRangeEnd.addEventListener("change", this.onChangeDayRangeEnd.bind(this))

		// hide all unused elements
		this.elementDay.classList.add(hiddenClass)
		this.elementDaySingle.classList.add(hiddenClass)
		this.elementDayRange.classList.add(hiddenClass)
		this.elementDayRangeTrackbar.classList.add(hiddenClass)
		this.elementMonth.classList.add(hiddenClass)
		this.elementMonthSingle.classList.add(hiddenClass)
		this.elementMonthRange.classList.add(hiddenClass)
		this.elementMonthRangeTrackbar.classList.add(hiddenClass)

		// manage trackbars
		this.trackbarMonthRange = new Trackbar(this.elementMonthRangeTrackbar)
		this.trackbarDayRange = new Trackbar(this.elementDayRangeTrackbar)
		this.trackbarMonthRange.addEventListener(this.onChangeMonthTrackbar.bind(this))
		this.trackbarDayRange.addEventListener(this.onChangeDayTrackbar.bind(this))

		// TODO: fill <select> fields
		for (const select of [this.inputMonthSingle, this.inputMonthRangeStart, this.inputMonthRangeEnd,]) {
			for (const month of monthValues) {
				const option = document.createElement("option")
				option.value = month
				option.innerText = getMonthDisplayString(month)
				select.appendChild(option)
			}
			select.value = ""
		}
	}

	onChangeTimeUnit() {
		if (this.inputUnitTimeDay.checked) {
			this.elementDay.classList.remove(hiddenClass)
			this.elementMonth.classList.add(hiddenClass)
		} else {
			this.elementDay.classList.add(hiddenClass)
			this.elementMonth.classList.remove(hiddenClass)
		}
	}

	onChangeTimeFrame() {
		if (this.inputFrameTimeSingle.checked) {
			this.elementDaySingle.classList.remove(hiddenClass)
			this.elementDayRange.classList.add(hiddenClass)
			this.elementMonthSingle.classList.remove(hiddenClass)
			this.elementMonthRange.classList.add(hiddenClass)
		} else {
			this.elementDaySingle.classList.add(hiddenClass)
			this.elementDayRange.classList.remove(hiddenClass)
			this.elementMonthSingle.classList.add(hiddenClass)
			this.elementMonthRange.classList.remove(hiddenClass)
		}
	}

	onChangeMonthSingle() {
		const value = this.inputMonthSingle.value
		this.displayMonth(value)
	}

	onChangeMonthRangeStart() {
		const value = this.inputMonthRangeStart.value
		// this.inputFieldMonthRangeEnd.min = value
		if (compareMonths(this.inputMonthRangeEnd.value, value) < 0)
			this.inputMonthRangeEnd.value = value

		this.updateMonthTrackbar()
	}

	onChangeMonthRangeEnd() {
		const value = this.inputMonthRangeEnd.value
		// this.inputFieldMonthRangeStart.max = value
		if (compareMonths(this.inputMonthRangeStart.value, value) > 0)
			this.inputMonthRangeStart.value = value

		this.updateMonthTrackbar()
	}

	updateMonthTrackbar() {
		const start = this.inputMonthRangeStart.value
		const end = this.inputMonthRangeEnd.value

		if (start && end)
			this.elementMonthRangeTrackbar.classList.remove(hiddenClass)
		else
			return

		const steps = countMonthsInBetween(start, end)
		const items = getMonthsInBetween(start, end)
		const labels = getMonthsDisplayStringsInBetween(start, end)
		this.trackbarMonthRange.setOptions({ steps, items, labels, step: 0 })
		this.elementMonthRangeTrackbar.classList.remove("hidden")
	}

	onChangeMonthTrackbar() {
		const item = this.trackbarMonthRange.getItem()
		this.displayMonth(item)
	}

	onChangeDaySingle() {
		const value = this.inputDaySingle.value
		this.displayDay(value)
	}

	onChangeDayRangeStart() {
		const value = this.inputDayRangeStart.value
		// this.inputFieldDayRangeEnd.min = value
		if (compareDateStrings(this.inputFieldDayRangeEnd.value < value) < 0)
			this.inputFieldDayRangeEnd.value = value

		this.updateDayTrackbar()
	}

	onChangeDayRangeEnd() {
		const value = this.inputFieldDayRangeEnd.value
		// this.inputFieldDayRangeStart.max = value
		if (compareDateStrings(this.inputDayRangeStart.value < value) > 0)
			this.inputDayRangeStart.value = value

		this.updateDayTrackbar()
	}

	updateDayTrackbar() {
		const start = this.inputDayRangeStart.value
		const end = this.inputDayRangeEnd.value

		if (start && end)
			this.elementDayRangeTrackbar.classList.remove(hiddenClass)
		else
			return

		const between = getDatesInBetween(start, end)
		this.trackbarMonthRange.setOptions({
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

	displayMonth(value) {
		// TODO: finish
	}

	displayDay(value) {
		// TODO: finish
	}

}
