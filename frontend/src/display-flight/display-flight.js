import airlines from "../data/airlines.js"
import airportMap from "../data/airport-map.js"
import { getFlightHistory, getPlaneList } from "../data/rest-api.js"
import { animationFrameLoopRelativeTime, reduceAverage } from "../utils/misc.js"
import { allDates, getDatesInBetween, firstDate, lastDate } from "../utils/date-string.js"

const airportFillStyle = "black"
const airportRadius = 3
const flightLineNormalWidth = 3
const flightLineWideWidth = 6

function getDelayColor(delay) {
	delay = Math.max(-60, Math.min(60, delay)) / 60
	if (delay < 0) {
		const code = Math.round((1 + delay) * 0xFF).toString(16).padStart(2, "0")
		return `#${code}${code}FF`
	} else {
		const code = Math.round((1 - delay) * 0xFF).toString(16).padStart(2, "0")
		return `#FF${code}${code}`
	}
}

function getDelayColorRGB(delay) {
	delay = Math.max(-60, Math.min(60, delay)) / 60
	if (delay < 0) {
		const code = Math.round((1 + delay) * 0xFF)
		return [code, code, 0xFF]
	} else {
		const code = Math.round((1 - delay) * 0xFF)
		return [0xFF, code, code]
	}
}

/** @param {FlightHistory} fh */
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

		if (!origin || !destination)
			continue // invalid airport code (e.g. STX in Virgin Islands)

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

export default class DisplayFlight {

	async init() {
		/** @type {HTMLSelectElement} */
		const inputPlaneSelect = document.getElementById("input-plane")
		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById("flight-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.infoPanelAirline = document.getElementById("flight-info-panel-airline")
		this.infoPanelAircraft = document.getElementById("flight-info-panel-aircraft")
		this.infoPanelPassengers = document.getElementById("flight-info-panel-passengers")
		this.loadingLabel = document.getElementById("flight-loading")

		// load plane list
		this.loadingLabel.classList.remove("hidden")
		this.planes = await getPlaneList()
		this.loadingLabel.classList.add("hidden")

		// populate the plane select input field
		inputPlaneSelect.children[0].remove() // the loading tag
		for (const plane of this.planes) {
			const option = document.createElement("option")
			option.value = plane
			option.text = plane
			inputPlaneSelect.appendChild(option)
		}
		inputPlaneSelect.value = ""
		inputPlaneSelect.addEventListener("change", e => this.displayFlight(e.target.value))

		// initialise cache storage
		/** @type {PlaneDataMapping} */
		this.flightData = {}

		// apply global settings
		this.ctx.lineCap = "round"
	}

	async displayFlight(flight) {
		if (!flight) {
			this.infoPanelAirline.innerText = ""
			this.infoPanelAircraft.innerText = ""
			this.infoPanelPassengers.innerText = ""
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			return
		}

		// retrieve the data
		/** @type {PlaneData}*/
		let data;
		if (flight in this.flightData) {
			// we already have the data cached
			data = this.flightData[flight]
		} else {
			// notify the user that we're loading the data
			this.infoPanelAirline.innerText = "(loading...)"
			this.infoPanelAircraft.innerText = "(loading...)"
			this.infoPanelPassengers.innerText = "(loading...)"
			this.loadingLabel.classList.remove("hidden")

			// load the data
			const fh = await getFlightHistory(flight)
			data = processFlightHistory(fh)
			this.flightData[flight] = data // cache the data
		}

		// update display
		this.infoPanelAirline.innerText = data.carrier
		this.infoPanelAircraft.innerText = data.model
		this.infoPanelPassengers.innerText = data.passengers
		this.loadingLabel.classList.add("hidden")

		this.renderFlightData(data)
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	renderFlight(origin, destination) {
		this.ctx.beginPath()
		this.ctx.moveTo(origin.lat * this.canvas.width, origin.long * this.canvas.height)
		this.ctx.lineTo(destination.lat * this.canvas.width, destination.long * this.canvas.height)
		this.ctx.stroke()
	}

	/** @param {Airport[] | Set<Airport>} airports */
	renderAirports(airports) {
		this.ctx.fillStyle = airportFillStyle
		for (const airport of airports) {
			this.ctx.beginPath()
			this.ctx.ellipse(airport.lat * this.canvas.width, airport.long * this.canvas.height, airportRadius, airportRadius, 0, 0, Math.PI * 2)
			this.ctx.fill()
		}
	}

	/** 
	 * @param {PlaneData} data
	 * @param {string} from
	 * @param {string} to
	 */
	renderFlightsStatic(data, from, to) {
		const dates = getDatesInBetween(from, to)
		const flights = dates.map(t => data.schedule[t])
		const map = {}

		const airports = new Set()
		for (const flightsPerDay of flights) {
			for (const flight of flightsPerDay) {

				const org = flight.origin.code
				const dest = flight.destination.code
				const name = [org, dest].sort().join("-")
				const delay = flight.arrivalDelay

				if (name in map)
					map[name].push(delay)
				else
					map[name] = [delay]

				airports.add(flight.origin)
				airports.add(flight.destination)
			}
		}

		this.clearCanvas()
		this.ctx.globalAlpha = 1
		this.ctx.globalCompositeOperation = "normal"
		this.ctx.lineWidth = flightLineNormalWidth
		for (const [codes, values] of Object.entries(map)) {
			const [a, b] = codes.split("-").map(code => airportMap[code])
			const delay = values.reduce(reduceAverage)

			this.ctx.strokeStyle = getDelayColor(delay)
			// if (a.code === "DEN" || b.code === "DEN") {
			// 	this.ctx.globalAlpha = 1
			// 	this.ctx.globalCompositeOperation = "source-over"
			// }
			// else {
			// 	this.ctx.globalAlpha = 0.2
			// 	this.ctx.globalCompositeOperation = "destination-over"
			// }
			this.renderFlight(a, b)
		}

		// this.ctx.globalCompositeOperation = "normal"
		// this.ctx.globalAlpha = 1
		this.renderAirports(airports)
	}

	/**
	 * @param {PlaneDrawData} data
	 */
	async renderFlightsDynamic(data) {
		const { ctx, canvas: { height, width } } = this
		ctx.globalAlpha = 1
		ctx.globalCompositeOperation = "source-over"
		this.clearCanvas()

		{
			const { origin, destination } = data.current
			const ox = origin.lat * width
			const oy = origin.long * height
			const dx = destination.lat * width
			const dy = destination.long * height
			const deltaY = (dy - oy) * data.progress
			const deltaX = (dx - ox) * data.progress
			const endX = ox + deltaX
			const endY = oy + deltaY

			ctx.strokeStyle = getDelayColor(data.current.arrivalDelay)
			ctx.lineWidth = flightLineWideWidth
			ctx.beginPath()
			ctx.moveTo(ox, oy)
			ctx.lineTo(endX, endY)
			ctx.stroke()
		}

		const alphaStep = 1 / (data.history.length + 1)
		data.history.forEach((flight, index) => {
			ctx.globalAlpha = 1 - (alphaStep * (index + 1))
			ctx.strokeStyle = getDelayColor(flight.arrivalDelay)
			this.renderFlight(flight.origin, flight.destination)
		})
	}

	/** @param {PlaneData} data */
	async renderFlightData(data) {
		this.data = data
		this.renderFlightsStatic(data, firstDate, lastDate)
		return

		// const date = Object.keys(data.schedule)[0]
		// // const flights = data.schedule[date]
		// const flights = [].concat(...Object.values(data.schedule))

		// const width = this.canvas.width
		// const height = this.canvas.height
		// const ctx = this.ctx
		// ctx.clearRect(0, 0, width, height)

		// ctx.lineCap = "round"
		// ctx.lineWidth = 2

		// // for (const f of flights) {
		// // 	const ox = f.origin.lat * width
		// // 	const oy = f.origin.long * height
		// // 	const dx = f.destination.lat * width
		// // 	const dy = f.destination.long * height
		// // 	ctx.beginPath()
		// // 	ctx.strokeStyle = getDelayColor(f.arrivalDelay)
		// // 	ctx.moveTo(ox, oy)
		// // 	ctx.lineTo(dx, dy)
		// // 	ctx.stroke()
		// // }

		// const maxTime = 1000
		// let start = 0;
		// for await (const [time] of animationFrameLoopRelativeTime()) {
		// 	const end = Math.round(time / maxTime * flights.length)
		// 	for (let i = start; i < end && i < flights.length; i++) {
		// 		const f = flights[i]
		// 		const ox = f.origin.lat * width
		// 		const oy = f.origin.long * height
		// 		const dx = f.destination.lat * width
		// 		const dy = f.destination.long * height
		// 		ctx.beginPath()
		// 		ctx.strokeStyle = getDelayColor(f.arrivalDelay)
		// 		ctx.moveTo(ox, oy)
		// 		ctx.lineTo(dx, dy)
		// 		ctx.stroke()
		// 	}
		// 	if (end >= flights.length)
		// 		break
		// 	else
		// 		start = end
		// }

		// // ctx.lineWidth = 3
		// // const map = {}
		// // for (const f of flights) {
		// // 	const org = f.origin.code
		// // 	const dest = f.destination.code
		// // 	const name = [org, dest].sort().join("-")
		// // 	const color = getDelayColorRGB(f.arrivalDelay)
		// // 	if (name in map)
		// // 		map[name].push(color)
		// // 	else
		// // 		map[name] = [color]
		// // }
		// // for (const [codes, colors] of Object.entries(map)) {
		// // 	const [a, b] = codes.split("-").map(code => airportMap[code])
		// // 	const averageR = colors.map(t => t[0]).reduce((p, n) => p + n, 0) / colors.length
		// // 	const averageG = colors.map(t => t[1]).reduce((p, n) => p + n, 0) / colors.length
		// // 	const averageB = colors.map(t => t[2]).reduce((p, n) => p + n, 0) / colors.length
		// // 	const color = "#" + [averageR, averageG, averageB].map(t => t.toString(16).padStart(2, "0")).join("")
		// // 	ctx.strokeStyle = color
		// // 	ctx.beginPath()
		// // 	ctx.moveTo(a.lat * width, a.long * height)
		// // 	ctx.lineTo(b.lat * width, b.long * height)
		// // 	ctx.stroke()
		// // }
	}

	activated() {
	}

	deactivated() {
	}

}
