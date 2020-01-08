import airports from "./airports.js"

/** @type {AirportMap} */
const airportMap = {}
for (const airport of airports)
	airportMap[airport.code] = airport

/** This is a map of airport codes to airport objects. */
export default airportMap
