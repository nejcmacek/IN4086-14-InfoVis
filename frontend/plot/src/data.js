import { getAirportDelayType } from "../../src/data/rest-api.js"
import { getDatesInBetween } from "../../src/utils/date-string.js"
import { getMonthsInBetween, isMonth } from "../../src/utils/months.js"

export function getUrlParameters() {
	const url = new URL(location.href)
	const airport = url.searchParams.get("airport")
	const start = url.searchParams.get("start")
	const end = url.searchParams.get("end")

	if (!airport || !start || !end)
		throw new Error("Missing URL parameters.")

	return { airport, start, end }
}

export function getTimeInBetween(start, end) {
	return isMonth(start)
		? getMonthsInBetween(start, end)
		: getDatesInBetween(start, end)
}

/**
 * @param {URLParams} params 
 * @returns {Promise<AirportDelayTypes[]>} 
 */
export async function loadData(params) {
	const items = getTimeInBetween(params.start, params.end)
	const promises = items.map(t => getAirportDelayType(params.airport, t))
	const data = await Promise.all(promises)
	return data
}
