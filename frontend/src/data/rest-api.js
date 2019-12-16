export const host = "http://localhost:5003"

export function paramsToQueryString(args) {
	return "?" + Object
		.entries(args)
		.map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
		.join("&")
}

export function getUrl(path, args) {
	let url = host + (path.startsWith("/") ? path : "/" + path)
	if (args)
		url = url + paramsToQueryString(args)
	return url
}

export function getJsonData(path, args) {
	const url = getUrl(path, args)
	const response = fetch(url)
		.then(t => t.json())
	return response
}

/** @returns {Promise<FlightHistory>} */
export function getFlightHistory(tailNum) {
	return getJsonData("flighthistory", { tail_num: tailNum })
}

/** @returns {Promise<string[]>} */
export function getPlaneList() {
	return getJsonData("planelist").then(t => t.tail_num)
}