import airlines from "../data/airlines.js"
import airportMap from "../data/airport-map.js"
import { getFlightHistory } from "../data/rest-api.js"
import { allDates } from "../utils/date-string.js"

/**
 * @param {FlightHistory} fh
 * @returns {PlaneData}
 */
function processFlightHistory(fh) {
	const count = fh.FL_DATE.length
	const schedule = {}
	for (const date of allDates)
		schedule[date] = []

	for (let i = 0; i < count; i++) {
		const date = fh.FL_DATE[i]
		const arrivalTime = fh.ARR_TIME[i]
		const arrivalDelay = fh.ARR_DELAY[i]
		const departureTime = fh.DEP_TIME[i]
		const originCode = fh.ORIGIN[i]
		const destinationCode = fh.DEST[i]
		const origin = airportMap[originCode]
		const destination = airportMap[destinationCode]

		if (!origin || !destination || isNaN(arrivalTime) || isNaN(departureTime) || isNaN(arrivalDelay))
			continue // invalid airport code (e.g. STX in Virgin Islands) or data

		schedule[date].push({
			date,
			arrivalTime,
			arrivalDelay,
			departureTime,
			origin,
			destination
		})
	}

	return {
		carrier: fh.op_carrier ? airlines[fh.op_carrier] : "(unknown)",
		tailNumber: fh.tail_num,
		model: fh.model || "(unknown)",
		passengers: fh.passengers || "(unknown)",
		engineType: fh.engine_type || "(unknown)",
		engines: fh.engines || "(unknown)",
		type: fh.type || "(unknown)",
		schedule,
	}
}

export default class DataManager {

	constructor() {
		/** @type {PlaneDataMapping} */
		this.flightData = {} // cache storage
	}

	isLoaded(tailNum) {
		return (tailNum in this.flightData) && (!this.flightData[tailNum].loading)
	}

	getLoadedFlightData(tailNum) {
		if (!tailNum)
			return null

		const cacheItem = this.flightData[tailNum]
		if (cacheItem.loading)
			throw new Error("Data not yet loaded.")
			
		return cacheItem.data
	}

	async loadFlightData(tailNum) {
		if (!tailNum)
			return null

		let cacheItem = this.flightData[tailNum]

		if (!cacheItem) {
			// prepare
			const promise = getFlightHistory(tailNum)
			cacheItem = { loading: true, promise, data: null }
			this.flightData[tailNum] = cacheItem
			// process
			const fh = await promise
			const data = processFlightHistory(fh)
			cacheItem.data = data
			cacheItem.loading = false
			return data
		} else if (cacheItem.loading) {
			return await cacheItem.promise
		} else {
			return cacheItem.data
		}
	}

}
