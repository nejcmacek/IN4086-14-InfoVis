import { hostAddress } from "../settings.js"

/** Encodes given parameters as a query-string */
export function paramsToQueryString(args) {
	return "?" + Object
		.entries(args)
		.map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
		.join("&")
}

/** Gets the full absolute URL, given a path and a parameter objects */
export function getUrl(path, args) {
	let url = hostAddress + (path.startsWith("/") ? path : "/" + path)
	if (args)
		url = url + paramsToQueryString(args)
	return url
}

/** This is an error handler. The error is caught in app.js file. */
function onError(error) {
	throw error
}

/** Performs fetching of data and wires in the error handlers. */
export function doFetch(url) {
	return fetch(url).catch(t => onError(t))
}

/** Fetches remote data and parses it as a JSON. */
export function getJsonData(path, args) {
	const url = getUrl(path, args)
	const response = doFetch(url)
		.then(t => t.json())
	return response
}

/**
 * UNSAFE, use with care!
 * 
 * Some data is not a pure JSON. It may contains items such as NaN which JSON.parse() cannot parse, but this method can.
 */
export function getEvalJsonData(path, args) {
	const url = getUrl(path, args)
	const response = doFetch(url)
		.then(t => t.text())
		.then(t => eval(`(${t})`)) // UNSAFE, use with care
	return response
}

/**
 * Gets the history of a plane.
 * @returns {Promise<FlightHistory>}
 */
export function getFlightHistory(tailNum) {
	return getEvalJsonData("flighthistory", { tail_num: tailNum })
}

/**
 * Gets a list of planes.
 * @returns {Promise<string[]>}
 */
export function getPlaneList() {
	return getJsonData("planelist").then(t => t.tail_num)
}

/**
 * Gets average delay of an aiport for a given month.
 * @param {string} month 
 */
export function getAirportDelayMonth(month) {
	return getJsonData(`airportdelay?time=${month}`)
}

/**
 * Gets average delay of an aiport for a given date.
 * @param {string} date date-string for a selected date
 */
export function getAirportDelayDay(date) {
	return getJsonData(`airportdelay?time=${date}`)
}

/**
 * Gets average delay of an aiport for a given date or month.
 * @param {string} date date-string or month name
 */
export function getAirportDelay(time) {
	return getJsonData(`airportdelay?time=${time}`)
}

/**
 * Gets airport delay breakdown information (different types of delays).
 * @returns {Promise<AirportDelayTypes>}
 */
export function getAirportDelayType(airportCode, time) {
	return getJsonData(`airportdelaytypes?airport=${airportCode}&time=${time}`)
}

/** Returns a promise that resolves when the server loads all the required data. */
export function waitLoading() {
	return doFetch(getUrl("loadingwait")).then(() => null)
}
