import airports from "../data/airports.js"
import { registerListener } from "./adaptive-size.js"

const radius = 1

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("airport-map")
let ctx = canvas.getContext("2d")

function draw(size) {
	const { width, height } = size
	ctx.clearRect(0, 0, width, height)
	ctx.fillStyle = "red"

	for (const a of airports) {
		const x = width * a.lat
		const y = height * a.long
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill()
	}
}

export function init() {
	registerListener("airport-map", draw)
}
