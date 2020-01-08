import airportMap from "../../src/data/airport-map.js"
import { emptyElement } from "../../src/utils/misc.js"
import makeLinePlot from "./line-plot.js"
import makeStackPlot from "./stack-plot.js"

// Website settings
const viewportMargin = 356
const margin = { top: 24, right: 170, bottom: 40, left: 50 }

/** 
 * This class manages the general display settings of the website, primarily user interaction.
 */
export default class Display {

	/** 
	 * @param {URLParams} params 
	 * @param {AirportDelayTypes[]} delays
	 */
	constructor(params, delays) {
		this.params = params
		this.delays = delays
	}

	init() {
		// get references to relevant items
		this.plotStackHolder = document.getElementById("plot-holder-stack")
		this.plotStackSvg = document.getElementById("plot-svg-stack")
		this.plotLineHolder = document.getElementById("plot-holder-line")
		this.plotLineSvg = document.getElementById("plot-svg-line")
		this.choiceStack = document.getElementById("choice-stack")
		this.choiceLine = document.getElementById("choice-line")
		this.choiceHighlight = document.getElementById("choice-highlight")
		this.title = document.getElementById("title")

		// set title
		const { airport } = this.params
		this.title.innerText = `Airport Delays: [${airport}] ${airportMap[airport].name}`
		this.titleSizeThreshold = this.title.offsetWidth + viewportMargin
		console.log(this.titleSizeThreshold);
		this.small = false
		this.updateTitleSize()

		// render plots
		this.renderStackPlot()
		this.renderLinePlot()

		// display one plot
		/** @type {PlotType} */
		this.choice = null
		this.selectPlot("stack")

		// helper data
		this.sizeChanged = false

		// add listeners
		window.addEventListener("resize", () => this.onResize())
		this.choiceStack.addEventListener("click", () => this.selectPlot("stack"))
		this.choiceLine.addEventListener("click", () => this.selectPlot("line"))
	}

	/** Renders the Delay Cause plot. */
	renderStackPlot() {
		emptyElement(this.plotStackSvg)
		makeStackPlot(this.plotStackHolder, this.plotStackSvg, this.delays, margin)
	}

	/** Renders the Delay Type plot.. */
	renderLinePlot() {
		emptyElement(this.plotLineSvg)
		makeLinePlot(this.plotLineHolder, this.plotLineSvg, this.delays, margin)
	}

	/**
	 * Called when the selection of the plot to display changes.
	 * @param {PlotType} type 
	 */
	selectPlot(type) {
		if (this.choice === type)
			return

		this.choice = type
		if (type === "stack") {
			this.choiceStack.classList.add("selected")
			this.choiceLine.classList.remove("selected")
			this.choiceHighlight.classList.remove("right")
			this.plotStackHolder.classList.remove("hidden")
			this.plotLineHolder.classList.add("hidden")
			if (this.sizeChanged)
				this.renderStackPlot()
		} else {
			this.choiceStack.classList.remove("selected")
			this.choiceLine.classList.add("selected")
			this.choiceHighlight.classList.add("right")
			this.plotStackHolder.classList.add("hidden")
			this.plotLineHolder.classList.remove("hidden")
			if (this.sizeChanged)
				this.renderLinePlot()
		}
		this.sizeChanged = false
	}

	/** Handles window resizes. */
	onResize() {
		this.sizeChanged = true
		this.updateTitleSize()

		if (this.choice === "stack")
			this.renderStackPlot()
		else
			this.renderLinePlot()
	}

	/** We have some adaptive title size, which helps with readability on smaller screens. */
	updateTitleSize() {
		const shouldBeSmall = this.titleSizeThreshold > window.innerWidth
		if (this.small === shouldBeSmall)
			return

		this.small = shouldBeSmall
		if (shouldBeSmall)
			document.body.classList.add("small")
		else
			document.body.classList.remove("small")
	}

}
