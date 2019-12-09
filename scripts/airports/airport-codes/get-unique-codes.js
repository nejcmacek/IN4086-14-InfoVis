const fs = require("fs")

const unique = (value, index, self) => self.indexOf(value) === index
const getBetweenQuotes = t => t.substr(1, t.length - 2)

const airportsFile = "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/airports/airports.csv"
const airportsFileContent = fs.readFileSync(airportsFile, { encoding: "utf-8" })

const items = [
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-05.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-06.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-07.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-08.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-09.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-10.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-11.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-12.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-01.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-02.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-03.csv",
	// "B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-04.csv",
]

const codes = []
const airports = {}

for (const item of items) {
	const content = fs.readFileSync(item, { encoding: "utf8" })
	const lines = content.split("\n").slice(1)
	for (let line of lines) {
		line = line.trim()
		if (!line) continue
		// 0          1    2        3      4      5              6    7     8                   9
		// 2018-01-01,"UA","N76528","2427","LAS","Las Vegas, NV","NV","SFO","San Francisco, CA","CA"
		const [_, oAirport, oCity, oState, dAirport, dCity, dState] = line.match(/^\d+-\d+-\d+,"\w+","[a-zA-Z0-9_-]*","\d+","([a-zA-Z0-9]+)","([^"]+)","(\w+)","([a-zA-Z0-9]+)","([^"]+)","(\w+)"/)
		const x = [[oAirport, oCity, oState], [dAirport, dCity, dState]] //.map(t => t.map(getBetweenQuotes))
		for (const [code, city, state] of x) {
			if (codes.includes(code))
				break
			codes.push(code)
			airports[code] = {
				code,
				city,
				state,
			}
		}
	}
}

const airportDataMap = {}
const adm = {}
const airportsData = airportsFileContent
	.split("\n")
	.slice(1)
	.map(t => t.trim())
	.filter(t => !!t)
	.forEach(t => {
		let [_, code, name, lat, long] = t.match(/^"([a-zA-Z0-9]+)","([^"]+)",(-?\d*.?\d*),(-?\d*.?\d*)/)
		lat = Number(lat)
		long = Number(long)

		if (!codes.includes(code))
			return

		if (code in airportDataMap) {
			airportDataMap[code].push({ name, lat, long })
		} else {
			airportDataMap[code] = [{ name, lat, long }]
		}
	})

let count = 0
for (let item in airportDataMap) {
	const data = airportDataMap[item]
	if (data.length > 1) {
		count++
		const name = data.map(t => t.name).filter(unique).join(" | ")
		const lat = data.map(t => t.lat).reduce((p, n) => p + n, 0) / data.length
		const long = data.map(t => t.long).reduce((p, n) => p + n, 0) / data.length
		adm[item] = { code: item, name, lat, long }
		console.log("double: " + item)
	} else {
		adm[item] = { ...data[0], code: item }
		console.log("single: " + item)
	}
}

for (let item in adm) {
	const data = adm[item]
	data.city = airports[item].city
	data.state = airports[item].state
}

codes.sort()

const res = codes.map(t => adm[t])
const rs = JSON.stringify(res)
fs.writeFileSync("airports.json", rs)
console.log("count: " + count + " out of " + codes.length)
