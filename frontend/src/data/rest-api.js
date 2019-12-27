import { hostAddress } from "../settings.js"

export function paramsToQueryString(args) {
	return "?" + Object
		.entries(args)
		.map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
		.join("&")
}

export function getUrl(path, args) {
	let url = hostAddress + (path.startsWith("/") ? path : "/" + path)
	if (args)
		url = url + paramsToQueryString(args)
	return url
}

function onError(error) {
	throw error
}

export function doFetch(url) {
	return fetch(url).catch(t => onError(t))
}

export function getJsonData(path, args) {
	const url = getUrl(path, args)
	const response = doFetch(url)
		.then(t => t.json())
	return response
}

/** UNSAFE, use with care */
export function getEvalJsonData(path, args) {
	const url = getUrl(path, args)
	const response = doFetch(url)
		.then(t => t.text())
		.then(t => eval(`(${t})`)) // UNSAFE, use with care
	return response
}

/** @returns {Promise<FlightHistory>} */
export function getFlightHistory(tailNum) {
	return getEvalJsonData("flighthistory", { tail_num: tailNum })
}

/** @returns {Promise<string[]>} */
export function getPlaneList() {
	return getJsonData("planelist").then(t => t.tail_num)
}

export function getAirportDelayMonth(month) {
	return getJsonData(`airportdelay?time=${month}`)
}

export function getAirportDelayDay(date) {
	return getJsonData(`airportdelay?time=${date}`)
}

export function getAirportDelay(date) {
	return getJsonData(`airportdelay?time=${date}`)
}

export function waitLoading() {
	return doFetch(getUrl("loadingwait")).then(() => null)
}
