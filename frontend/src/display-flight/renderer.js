import airportMap from "../data/airport-map.js"
import { flightDisplaySettings as fds, flightDisplaySettings } from "../settings.js"
import { animationFrameLoopDetailed, filterUnique, reduceAverage } from "../utils/misc.js"

/** Gets the color (blue to white tot red) based on the given delay value. */
function getDelayColor(delay) {
	const mfd = flightDisplaySettings.maxFlightDelay
	delay = Math.max(-mfd, Math.min(mfd, delay)) / mfd
	if (delay < 0) {
		const code = Math.round((1 + delay) * 0xFF).toString(16).padStart(2, "0")
		return `#${code}${code}FF`
	} else {
		const code = Math.round((1 - delay) * 0xFF).toString(16).padStart(2, "0")
		return `#FF${code}${code}`
	}
}

/** Gets RGB values of the color (blue to white tot red) based on the given delay value. */
function getDelayColorRGB(delay) {
	const mfd = flightDisplaySettings.maxFlightDelay
	delay = Math.max(-mfd, Math.min(mfd, delay)) / mfd
	if (delay < 0) {
		const code = Math.round((1 + delay) * 0xFF)
		return [code, code, 0xFF]
	} else {
		const code = Math.round((1 - delay) * 0xFF)
		return [0xFF, code, code]
	}
}

/** This component handles the rendering of all the flight paths. A canvas and its 2D context is used for rendering. */
export default class FlightRenderer {

	/** @param {HTMLCanvasElement} canvas */
	constructor(canvas) {
		// drawing data
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.ctx.lineCap = "round"

		// semantic data
		/** @type {string} the selected airport code */
		this.selectedAirport = null

		// technical details
		this.animationLoop = null
		this.animationComplete = false

		this.image = new Image()
		this.image.src = "./media/plane.svg"
	}

	/** Stops all rendering. */
	stopRendering() {
		if (this.animationLoop)
			this.animationLoop.cancel()
	}

	/** Clears the canvas to transparent background. */
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	/** 
	 * Renders airport dots on the map
	 * @param {Airport[] | Set<Airport>} airports list of airports to render
	 */
	renderAirports(airports, allowFade = true) {
		this.ctx.fillStyle = fds.airportDefaultFillStyle
		for (const airport of airports) {
			if (allowFade && this.selectedAirport) { // set color
				if (airport.code === this.selectedAirport)
					this.ctx.fillStyle = fds.airportDefaultFillStyle
				else
					this.ctx.fillStyle = fds.airportFadedFillStyle
			}
			this.ctx.beginPath()
			this.ctx.ellipse(airport.lat * this.canvas.width, airport.long * this.canvas.height, fds.airportRadius, fds.airportRadius, 0, 0, Math.PI * 2)
			this.ctx.fill()
		}
	}

	/** Renders a flight - draws a line on the canvas. */
	renderFlight(origin, destination) {
		this.ctx.beginPath()
		this.ctx.moveTo(origin.lat * this.canvas.width, origin.long * this.canvas.height)
		this.ctx.lineTo(destination.lat * this.canvas.width, destination.long * this.canvas.height)
		this.ctx.stroke()
	}

	/** 
	 * Renders static flight data.
	 * @param {Flight[]} flights
	 */
	renderStatic(flights) {
		this.stopRendering()

		const map = {}
		const airports = new Set()

		// Create a list of routes (from one airport to another) and calculate
		// their average delays
		for (const flight of flights) {
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

		// Draw the calculated routes
		this.clearCanvas()
		this.ctx.globalAlpha = 1
		this.ctx.globalCompositeOperation = "normal"
		this.ctx.lineWidth = fds.flightLineNormalWidth

		// For each route...
		for (const [codes, values] of Object.entries(map)) {
			const [a, b] = codes.split("-").map(code => airportMap[code])
			const delay = values.reduce(reduceAverage)

			this.ctx.strokeStyle = getDelayColor(delay)
			if (this.selectedAirport) { // set focus to the selected airport
				// Update the opacity and composite operation style
				if (a.code === this.selectedAirport || b.code === this.selectedAirport) {
					this.ctx.globalAlpha = 1
					this.ctx.globalCompositeOperation = "source-over"
				} else {
					this.ctx.globalAlpha = 0.2
					this.ctx.globalCompositeOperation = "destination-over"
				}
			}
			// daw the line
			this.renderFlight(a, b)
		}

		// Eender the airports over all teh data
		this.ctx.globalAlpha = 1
		this.ctx.globalCompositeOperation = "normal"
		this.renderAirports(airports)
	}

	/**
	 * Renders dynamic flight data. This method does not perform actually rendering, but handles the rendering 
	 * and animation logic behind it.
	 * @param {PlaneDrawData} drawData the data to draw
	 * @param {boolean} retainProgress forces a re-render without loosing progress of the current animation
	 * @param {number} maxFlightHistorySize
	 */
	async renderDynamic(drawData, retainProgress = false, maxFlightHistorySize = Infinity) {
		this.drawData = drawData

		// prepare assets
		const airports = drawData.history
			.flatMap(t => [t.origin, t.destination])
			.filter(filterUnique)

		if (retainProgress && this.drawData === drawData) {
			// don't start an animation loop, just draw the data
			if (this.animationComplete)
				this.renderFlightProgress(drawData, airports, 1, maxFlightHistorySize)
			// else { the animation is already in progress }
			return
		}

		// stop the previous animation loop (we're starting a new one)
		this.stopRendering()

		// start the animation loop (and cancel the previous one, if active)
		const animationLoop = animationFrameLoopDetailed()
		this.animationLoop = animationLoop
		this.animationComplete = false

		for await (const time of this.animationLoop) {
			// The code inside this loop efficiently runs every time the browser re-renders the screen,
			// as per the modern browser recommendations.

			// calculate progress and render flights
			const progress = Math.min(time.diff / drawData.time, 1)
			this.renderFlightProgress(drawData, airports, progress, maxFlightHistorySize)

			// if we've complete the animation, exit
			if (progress === 1) {
				this.animationComplete = true
				break
			}
		}

		// clean-up resources, if applicable
		if (this.animationLoop === animationLoop)
			this.animationLoop = null // dispose
	}

	/** 
	 * This method actually performs the rendering of flights, when dynamic mode is selected.
	 * @param {PlaneDrawData} drawData 
	 * @param {Airport[]} airports
	 * @param {number} progress
	 * @param {number} maxFlightHistorySize
	*/
	renderFlightProgress(drawData, airports, progress, maxFlightHistorySize) {
		const ctx = this.ctx
		this.clearCanvas()

		// render flight history
		ctx.globalCompositeOperation = "source-over"
		ctx.lineWidth = fds.flightLineNormalWidth
		const alphaStep = 1 / Math.min(fds.dynamicDisplayHistorySize, maxFlightHistorySize)
		const alphaProgressCorrection = alphaStep * progress

		drawData.history.forEach((flight, index) => {
			ctx.globalAlpha = 1 - (alphaStep * index + alphaProgressCorrection)
			ctx.strokeStyle = getDelayColor(flight.arrivalDelay)
			this.renderFlight(flight.origin, flight.destination)
		})

		// render airports
		ctx.globalAlpha = 1
		this.renderAirports(airports, false)

		// render current flight
		ctx.globalAlpha = 1
		ctx.strokeStyle = getDelayColor(drawData.current.arrivalDelay)
		ctx.lineWidth = fds.flightLineWideWidth
		this.renderFlightCurrentProgress(drawData.current, progress)
	}

	/** 
	 * This renders the current flight when rendering mode is set to dynamics. It also render the plane icon.
	 * @param {Flight} flight */
	renderFlightCurrentProgress(flight, progress) {
		const { ctx, canvas: { height, width }, image } = this
		const ox = flight.origin.lat * width
		const oy = flight.origin.long * height
		const dx = flight.destination.lat * width
		const dy = flight.destination.long * height
		const deltaY = (dy - oy) * progress
		const deltaX = (dx - ox) * progress
		const endX = ox + deltaX
		const endY = oy + deltaY
		const angle = Math.atan2(-deltaY, deltaX)

		// draw current line
		ctx.beginPath()
		ctx.moveTo(ox, oy)
		ctx.lineTo(endX, endY)
		ctx.stroke()

		// draw current airports
		this.renderAirports([flight.origin, flight.destination], false)

		// draw plane icon
		if (image.complete) {
			const centerOffset = fds.planeImageSize / 2
			ctx.save()
			ctx.imageSmoothingEnabled = true // progress === 1
			ctx.imageSmoothingQuality = progress === 1 ? "high" : "low"
			ctx.translate(endX, endY)
			ctx.rotate(-angle + fds.defaultImageRotation)
			ctx.translate(-endX, -endY)
			ctx.drawImage(this.image, endX - centerOffset, endY - centerOffset, fds.planeImageSize, fds.planeImageSize)
			ctx.restore()
		}

		this.stopRendering() // all animations are done at this point
	}

}
