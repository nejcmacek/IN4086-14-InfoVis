/// <reference path="types.d.ts" />

/** @type HTMLCanvasElement */
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const img = document.getElementById("img-usa")
const imgSize = [960, 600]
canvas.height = img.height
canvas.width = img.width

const rescale = () => {
	const heightWindow = window.innerHeight
	const widthWindow = window.innerWidth
	const [widthImage, heightImage] = imgSize

	const aspectWindow = widthWindow / heightWindow
	const aspectImage = widthImage / heightImage

	let heightItem;
	let widthItem;

	if (aspectWindow >= aspectImage) {
		// height is the same
		heightItem = heightWindow
		widthItem = heightItem * aspectImage
	} else {
		widthItem = widthWindow
		heightItem = widthItem / aspectImage
	}

	for (const elt of document.getElementsByClassName("adaptive-size")) {
		elt.style.height = `${heightItem}px`
		elt.style.width = `${widthItem}px`
	}

	redraw()
}

window.addEventListener("mousedown", e => {
	if (e.button === 1) {
		const x = e.pageX / window.innerWidth
		const y = e.pageY / window.innerHeight
		scale.x = x
		scale.y = y
		console.log("changing scale", scale)
		redraw()
	} else if (e.button === 0) {
		const x = e.pageX / window.innerWidth * 2 - 1
		const y = e.pageY / window.innerHeight * 2 - 1
		translate.x = x
		translate.y = y
		console.log("changing translate", translate)
		redraw()
	}
})

let mainland = {
	scale: {
		x: 0.016,
		y: -0.035,
	},
	translate: {
		x: 0.75,
		y: 1.4,
	},
	preTranslate: {
		x: 81,
		y: -12
	},
}

let radius = 3

function transformMainlandX(x) { return (x + mainland.preTranslate.x) * mainland.scale.x + mainland.translate.x }
function transformMainlandY(y) { return (y + mainland.preTranslate.y) * mainland.scale.y + mainland.translate.y }

function redraw() {
	const width = canvas.width = canvas.clientWidth
	const height = canvas.height = canvas.clientHeight
	ctx.clearRect(0, 0, width, height)
	ctx.fillStyle = "red"

	for (const a of airports) {
		// const x = width * transformMainlandX(a.long)
		// const y = height * transformMainlandY(a.lat)
		const x = width * a.lat
		const y = height * a.long
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill()
	}
}

function print() {
	console.log(scale, translate)
}

function getAirports() {
	return airports.map(t => ({
		...t,
		lat: transformMainlandX(t.lat),
		long: transformMainlandY(t.long),
	}))
}


function init() {
	window.addEventListener("resize", rescale)
	rescale()
}

init()

