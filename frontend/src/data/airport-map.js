import airports from "./airports.js"

/** @type {AirportMap} */
const airportMap = {}
for (const airport of airports)
	airportMap[airport.code] = airport

export default airportMap
