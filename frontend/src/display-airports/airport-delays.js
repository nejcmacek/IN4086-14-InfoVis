import airportMap from "../data/airport-map.js"
import { getAirportDelay } from "../data/rest-api.js"
import { airportsDisplaySettings as ads } from "../settings.js"

function getDelayColorCode(value) {
	value = value / ads.maxAirportDelay
	value = Math.max(0, Math.min(1, value))
	const hex = Math.round(((1 - value) * 255))
	const code = hex.toString(16).padStart(2, "0")
	return `#ff${code}${code}`
}

export default class AirportDelays {

	constructor() {
		/** @type {CacheDelayData} */
		this.delayCache = []
		this.currentDate = null
		this.isLoading = false
		this.currentDelays = null
		this.listeners = []

		/** @type {HTMLDivElement} */
		this.displayMap = document.getElementById("airport-map")
		this.loadingLabel = document.getElementById("airport-loading")
	}

	/** @param {string[]} values */
	declareDisplayDomain(values) {
		for (const date of values) {
			if (!(date in this.delayCache)) {
				/** @type {CacheDelayDataItem} */
				const promise = getAirportDelay(date)
				const item = {
					loading: true,
					promise,
					data: null
				}
				this.delayCache[date] = item
				promise.then(t => {
					item.loading = false
					item.data = t
					if (this.currentDate === date)
						this.displayDate(date)
				})
			}
		}
	}

	/** @param {string} date */
	displayDate(date) {
		this.currentDate = date
		const item = this.delayCache[date]
		if (item.loading) {
			this.setLoading(true)
		} else {
			this.setLoading(false)
			this.displayDelay(item.data)
		}
	}

	/** @param {DelayData} data */
	displayDelay(data) {
		this.currentDelays = data

		for (let airportCode in data) {
			const airport = airportMap[airportCode]
			if (!airport)
				continue // we skip airports not on the map

			/** @type {HTMLElement} */
			const ring = airportMap[airportCode].ring
			const delay = data[airportCode]
			ring.style.background = getDelayColorCode(delay)
		}

		this.emit(data)
	}

	/** @param {boolean} value */
	setLoading(value) {
		if (this.isLoading === value)
			return

		this.isLoading = value
		if (value) {
			this.loadingLabel.classList.remove("hidden")
		} else {
			this.loadingLabel.classList.add("hidden")
		}
	}

	emit(data) {
		for (const listener of this.listeners) {
			listener.call(this, data)
		}
	}

	addEventListener(listener) {
		if (!this.listeners.includes(listener))
			this.listeners.push(listener)
	}

	removeEventListener(listener) {
		const index = this.listeners.indexOf(listener)
		if (index >= 0)
			this.listeners.splice(index, 1)
	}

}