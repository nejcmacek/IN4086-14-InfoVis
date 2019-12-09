const fs = require("fs")
const args = process.argv.slice(2)
const inFileAirports = args[0] || "./airports-50states.json"
const inFileBlender = args[1] || "./blender-export.json"
const outFileAirports = args[2] || "./airports-50states-adjusted.json"

if (inFileAirports === outFileAirports)
	throw new Error("Same in/out file.")

const fileAirports = require(inFileAirports)
const fileBlender = require(inFileBlender)

if (fileBlender.first.length !== fileBlender.last.length || fileBlender.first.length !== fileAirports.length)
	throw new Error("Invalid length")

const length = fileAirports.length
const results = []
const eps = 0.00001

for (let i = 0; i < length; i++) {
	const [fLat, fLong] = fileBlender.first[i]
	const [lLat, lLong] = fileBlender.last[i]
	const airports = fileAirports.filter(t =>
		(Math.abs(t.long - fLong) < eps) && (Math.abs(t.lat - fLat) < eps)
	)
	if (airports.length !== 1)
		console.log("Invalid airports selection: " + airports.length)
	const airport = {
		...airports[0],
		long: 1 - lLong,
		lat: lLat,
	}
	results.push(airport)
}

results.sort((a, b) => a.code.localeCompare(b.code))

fs.writeFileSync(outFileAirports, JSON.stringify(results))
