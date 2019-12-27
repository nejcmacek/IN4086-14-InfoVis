import { compareDateStrings, isValid } from "../utils/date-string.js"
import EventListener from "../utils/event-listener.js"
import { compareMonths, getMonthDisplayString, monthValues } from "../utils/months.js"

const hiddenClass = "hidden"

export default class InputControl extends EventListener {

	init() {
		// retrieve element references
		this.inputUnitTimeDay = document.getElementById("ui-input-unit-time-day")
		this.inputUnitTimeMonth = document.getElementById("ui-input-unit-time-month")
		this.inputFrameTimeSingle = document.getElementById("ui-input-frame-time-single")
		this.inputFrameTimeRange = document.getElementById("ui-input-frame-time-range")
		this.inputMonthSingle = document.getElementById("ui-input-field-month-single")
		this.inputMonthRangeStart = document.getElementById("ui-input-field-month-range-start")
		this.inputMonthRangeEnd = document.getElementById("ui-input-field-month-range-end")
		this.inputDaySingle = document.getElementById("ui-input-field-day-single")
		this.inputDayRangeStart = document.getElementById("ui-input-field-day-range-start")
		this.inputDayRangeEnd = document.getElementById("ui-input-field-day-range-end")
		this.elementMonth = document.getElementById("ui-input-control-month")
		this.elementMonthSingle = document.getElementById("ui-input-control-month-single")
		this.elementMonthRange = document.getElementById("ui-input-control-month-range")
		this.elementDay = document.getElementById("ui-input-control-day")
		this.elementDaySingle = document.getElementById("ui-input-control-day-single")
		this.elementDayRange = document.getElementById("ui-input-control-day-range")

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
		this.elementMonth.classList.add(hiddenClass)
		this.elementMonthSingle.classList.add(hiddenClass)
		this.elementMonthRange.classList.add(hiddenClass)

		this.valueDaySingle = null
		this.valueDayRange = null
		this.valueMonthSingle = null
		this.valueMonthRange = null

		/** @type {TimeUnit} */
		this.selectedTimeUnit = null
		/** @type {TimeFrame} */
		this.selectedTimeFrame = null
		/** @type {DisplayType} */
		this.selectedDisplayType = null

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

	getCurrentStatus() {
		if (this.selectedDisplayType)
			return {
				displayType: this.selectedDisplayType,
				value: this.getValue(this.selectedDisplayType)
			}
		else
			return null
	}

	/** @param {DisplayType} displayType */
	getValue(displayType) {
		switch (displayType) {
			case "day-single":
				return this.valueDaySingle
			case "day-range":
				return this.valueDayRange
			case "month-single":
				return this.valueMonthSingle
			case "month-range":
				return this.valueMonthRange
			default:
				throw new Error("Invalid DisplayType.")
		}
	}

	/** @param {DisplayType} [displayType] */
	isInitialised(displayType) {
		if (displayType === undefined) {
			if (!this.selectedDisplayType)
				return false
			return !!this.getValue(this.selectedDisplayType)
		} else {
			return !!this.getValue(displayType)
		}
	}

	onDisplayChanged() {
		if (!this.selectedTimeUnit || !this.selectedTimeFrame)
			return

		this.selectedDisplayType = this.selectedTimeUnit + "-" + this.selectedTimeFrame
		this.emit("display-change", {
			displayType: this.selectedDisplayType,
			timeFrame: this.selectedTimeFrame,
			timeUnit: this.selectedTimeUnit,
		})

		if (this.isInitialised(this.selectedDisplayType))
			this.onValueChanged(this.selectedDisplayType, this.getValue(this.selectedDisplayType))
	}

	/**
	 * @param {DisplayType} displayType 
	 * @param {string | string[]} value
	 */
	onValueChanged(displayType, value) {
		this.emit("value-change", {
			displayType,
			value,
		})
	}

	onChangeTimeUnit() {
		if (this.inputUnitTimeDay.checked) {
			this.selectedTimeUnit = "day"
			this.elementDay.classList.remove(hiddenClass)
			this.elementMonth.classList.add(hiddenClass)
		} else {
			this.selectedTimeUnit = "month"
			this.elementDay.classList.add(hiddenClass)
			this.elementMonth.classList.remove(hiddenClass)
		}

		this.onDisplayChanged()
	}

	onChangeTimeFrame() {
		if (this.inputFrameTimeSingle.checked) {
			this.selectedTimeFrame = "single"
			this.elementDaySingle.classList.remove(hiddenClass)
			this.elementDayRange.classList.add(hiddenClass)
			this.elementMonthSingle.classList.remove(hiddenClass)
			this.elementMonthRange.classList.add(hiddenClass)
		} else {
			this.selectedTimeFrame = "range"
			this.elementDaySingle.classList.add(hiddenClass)
			this.elementDayRange.classList.remove(hiddenClass)
			this.elementMonthSingle.classList.add(hiddenClass)
			this.elementMonthRange.classList.remove(hiddenClass)
		}

		this.onDisplayChanged()
	}

	onChangeMonthSingle() {
		const value = this.inputMonthSingle.value
		if (value) {
			this.valueMonthSingle = value
			this.onValueChanged("month-single", value)
		}
	}

	onChangeMonthRangeStart() {
		const value = this.inputMonthRangeStart.value
		if (!this.inputMonthRangeEnd.value || !value)
			return

		if (compareMonths(this.inputMonthRangeEnd.value, value) < 0)
			this.inputMonthRangeEnd.value = value

		this.valueMonthRange = [value, this.inputMonthRangeEnd.value]
		this.onValueChanged("month-range", this.valueMonthRange)
	}

	onChangeMonthRangeEnd() {
		const value = this.inputMonthRangeEnd.value
		if (!this.inputMonthRangeStart.value || !value)
			return

		if (compareMonths(this.inputMonthRangeStart.value, value) > 0)
			this.inputMonthRangeStart.value = value

		this.valueMonthRange = [this.inputMonthRangeStart.value, value]
		this.onValueChanged("month-range", this.valueMonthRange)
	}

	onChangeDaySingle() {
		const value = this.inputDaySingle.value
		if (value && isValid(value)) {
			this.valueDaySingle = value
			this.onValueChanged("day-single", value)
		}
	}

	onChangeDayRangeStart() {
		const value = this.inputDayRangeStart.value
		if (!this.inputDayRangeEnd.value || !value || !isValid(value))
			return

		if (compareDateStrings(this.inputDayRangeEnd.value, value) < 0)
			this.inputDayRangeEnd.value = value

		this.valueDayRange = [value, this.inputDayRangeEnd.value]
		this.onValueChanged("day-range", this.valueDayRange)
	}

	onChangeDayRangeEnd() {
		const value = this.inputDayRangeEnd.value
		if (!this.inputDayRangeStart.value || !value || !isValid(value))
			return

		if (compareDateStrings(this.inputDayRangeStart.value, value) > 0)
			this.inputDayRangeStart.value = value

		this.valueDayRange = [this.inputDayRangeStart.value, value]
		this.onValueChanged("day-range", this.valueDayRange)
	}

}	
