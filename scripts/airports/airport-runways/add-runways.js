const fs = require("fs")
const args = process.argv.slice(2)

const inFileAirports = args[0] || "./airports-50states-adjusted.json"
const inFileRunways = args[1] || "./runways.csv"
const outFile = args[2] || "./airports-final.json"

const inAirports = require(inFileAirports)
const runways = fs.readFileSync(inFileRunways, { encoding: "utf8" })
	.trim()
	.split("\n")
	.slice(1)
	.map(t => t.split(","))
	.map(([code, runways, note]) => ({ code, runways: Number(runways), note: note ? note.trim() : null, used: false }))
	.reduce((p, n) => (p[n.code] = n, p), {})

const missingEntries = inAirports.filter(t => !(t.code in runways))
if (missingEntries.length) {
	missingEntries.forEach(t => console.log(`Missing a runway count for airport "${t.code}"`))
	process.exit(1)
}

const outAirports = inAirports.map(t => ({
	...t,
	runways: runways[t.code].runways
}))

inAirports.forEach(t => runways[t.code].used = true)
Object.values(runways)
	.filter(t => !t.used)
	.forEach(t => console.log(`Entry "${t.code}" not used (note: ${t.note})`))

fs.writeFileSync(outFile, JSON.stringify(outAirports))
