import { trackbarSettings } from "../settings.js"

/** 
 * This components represents and renders a trackbar and handles it.
 */
export default class Trackbar {

	/** @param {HTMLElement} trackbar */
	/** @param {TrackbarOptions} [options] */
	constructor(element, options) {
		// build UI - create elements
		const trackbar = document.createElement("div")
		const endpointLeft = document.createElement("div")
		const endpointRight = document.createElement("div")
		const barHolder = document.createElement("div")
		const bar = document.createElement("div")
		const cursor = document.createElement("div")
		const label = document.createElement("div")
		const play = document.createElement("div")
		const controls = document.createElement("div")

		// build UI - handle the root element
		element.classList.add("trackbar-holder")
		while (element.firstChild) // empty the element
			element.removeChild(element.firstChild)

		// build UI - set classnames
		trackbar.className = "trackbar"
		endpointLeft.className = "endpoint left"
		endpointRight.className = "endpoint right"
		barHolder.className = "bar-holder"
		bar.className = "bar"
		cursor.className = "cursor"
		label.className = "trackbar-label hidden"
		play.className = "trackbar-play"
		controls.className = "controls"

		// build UI - set attributes
		trackbar.setAttribute("tabindex", "0")

		// build UI - attach elements
		barHolder.appendChild(bar)
		barHolder.appendChild(cursor)
		trackbar.appendChild(endpointLeft)
		trackbar.appendChild(endpointRight)
		trackbar.appendChild(barHolder)
		controls.appendChild(play)
		controls.appendChild(trackbar)
		element.appendChild(controls)
		element.appendChild(label)

		// store element references
		this.element = element
		this.trackbar = trackbar
		this.cursor = cursor
		this.label = label
		this.play = play

		// mouse tracking even handlers
		this.mouseDownHandler = this.onMouseDown.bind(this)
		this.mouseMoveHandler = this.onMouseMove.bind(this)
		this.playClickHandler = this.onPlayClick.bind(this)
		this.keyDownHandler = this.onKeyDown.bind(this)
		trackbar.addEventListener("mousedown", this.mouseDownHandler)
		play.addEventListener("click", this.playClickHandler)
		trackbar.addEventListener("keydown", this.keyDownHandler)

		// trackbar's events
		this.listeners = []

		// values
		this.value = 0
		this.playing = false
		this.playInterval = NaN
		this.playDelay = trackbarSettings.defaultPlayDelay;
		this.setOptions(options)
	}

	/** Sets display options.
	 * @param {TrackbarOptions} [options] 
	 */
	setOptions(options) {
		this.setPlaying(false)

		if (typeof options.playDelay === "number")
			this.setPlayDelay(options.playDelay)

		if (options && this.isValidStepsNumber(options.steps)) {
			// update settings
			this.steps = options.steps
			this.labels = null
			this.items = null
			if (options.items && options.items.length !== options.steps)
				throw new Error("Number of items does not match the number of steps.")
			if (options.labels && options.labels.length !== options.steps)
				throw new Error("Number of labels does not match the number of steps.")
			this.items = options.items || null
			this.labels = options.labels || null

			// update label display
			if (this.labels)
				this.label.classList.remove("hidden")
			else
				this.label.classList.add("hidden")

			// update the value
			if (typeof options.step === "number") {
				if (typeof options.value === "number")
					throw new Error("Both value and step given.")
				this.setStep(options.step)
			} else if (typeof options.value === "number") {
				this.setValue(options.value)
			} else {
				this.setValue(this.value)
			}

		} else {
			// update the settings
			this.step = -1
			this.steps = NaN
			this.items = null
			this.labels = null
			this.label.classList.add("hidden")

			// validate
			if (options && typeof options.step === "number")
				throw new Error("Step option not available in this context.")

			// update the value
			if (options && typeof options.value === "number")
				this.setValue(options.value)
			else
				this.setValue(this.value)
		}
	}

	/** @param {TrackbarEventHandler<Trackbar>} fn */
	addEventListener(fn) {
		if (!this.listeners.includes(fn))
			this.listeners.push(fn)
	}

	/** @param {TrackbarEventHandler<Trackbar>} fn */
	removeEventListener(fn) {
		const i = this.listeners.indexOf(fn)
		if (i >= 0)
			this.listeners.splice(i, 1)
	}

	/** Fired when the value of the trackbar changes. Emits the event. */
	onChange() {
		const arg = {
			value: this.value,
			step: this.step,
			item: this.items && this.items[this.step],
			labels: this.labels && this.items[this.step],
		}
		for (const listener of this.listeners)
			listener.call(this, arg)
	}

	/** Checks if the given number of steps is valid. */
	isValidStepsNumber(num) {
		return isFinite(num) && num > 0
	}

	/** Checks if continuous or step-mode is enabled. */
	hasSteps() {
		return this.isValidStepsNumber(this.steps)
	}

	/** Gets the active item. */
	getItem() {
		if (this.items)
			return this.items[this.step] || null
		else
			return null
	}

	/** Gets the active label. */
	getLabel() {
		if (this.labels)
			return this.labels[this.step] || null
		else
			return null
	}

	/** Updates the UI elements. */
	updateUIElements() {
		this.cursor.style.left = (this.value * 100) + "%"
		if (this.labels) {
			const label = this.labels[this.step]
			this.label.innerText = label
		}
	}

	/** Sets the value and updates the trackbar accordingly. */
	setValue(value) {
		value = Math.max(0, Math.min(1, value))

		if (this.hasSteps()) {
			this.step = Math.round(value * (this.steps - 1))
			this.value = value = this.step / (this.steps - 1)
		} else {
			this.value = value
			this.step = -1
		}

		this.updateUIElements()
		this.onChange()
	}

	/** Sets the current step and updates the trackbar accordingly. */
	setStep(step) {
		if (!this.hasSteps())
			throw new Error("No steps defined.")

		step = Math.max(0, Math.min(step, this.steps - 1))
		this.step = step
		this.value = step / (this.steps - 1) || 0
		this.updateUIElements()
		this.onChange()
	}

	/** Focuses the trackbar so that arrow keys can be used. */
	focus() {
		this.trackbar.focus()
	}

	/** @param {MouseEvent} e */
	onMouseDown(e) {
		if (e.button !== 0)
			return

		e.preventDefault()
		this.startMouseTracking()
		this.focus()
		this.locMouseX = e.clientX
		this.locBounds = this.trackbar.getBoundingClientRect()

		if (e.target !== this.cursor) {
			// move the cursor to the clicked area
			const box = this.locBounds
			const x = e.clientX - box.left - (trackbarSettings.cursorSize / 2)
			const width = this.trackbar.clientWidth - trackbarSettings.cursorSize
			const loc = x / width
			this.setValue(loc)
		}
	}

	/** @param {MouseEvent} e */
	onMouseMove(e) {
		if ((e.buttons & 1) === 0) {
			this.stopMouseTracking()
			return
		}

		e.preventDefault()

		// get location of the cursor, in pixels
		const dx = e.clientX - this.locBounds.left
		const loc = dx / this.trackbar.clientWidth
		this.setValue(loc)
	}

	startMouseTracking() {
		if (this.mouseTracking)
			return
		this.mouseTracking = true
		document.addEventListener("mousemove", this.mouseMoveHandler)
	}

	stopMouseTracking() {
		if (!this.mouseTracking)
			return
		this.mouseTracking = false
		document.removeEventListener("mousemove", this.mouseMoveHandler)
	}

	onPlayClick() {
		this.focus()
		this.togglePlaying()
	}

	setPlayDelay(delay) {
		this.playDelay = delay || trackbarSettings.defaultPlayDelay
	}

	/** Sets whether the trackbar is playing or not. */
	setPlaying(value) {
		if (value === this.playing)
			return

		if (!this.canPlay())
			return

		this.playing = value
		if (value) {
			this.element.classList.add("playing")
			this.playInterval = setInterval(() => this.playMakeStep(), this.playDelay)
			this.playMakeStep()
		} else {
			this.stopPlaying()
		}
	}

	/** Sets whether the trackbar is playing or not. Toggles it. */
	togglePlaying() {
		this.setPlaying(!this.playing)
	}

	playMakeStep() {
		if (!this.playing || !this.canPlay()) {
			this.stopPlaying()
			return
		}
		const step = (this.step + 1) % this.steps
		this.setStep(step)
	}

	stopPlaying() {
		clearInterval(this.playInterval)
		this.playInterval = NaN
		this.playing = false
		this.element.classList.remove("playing")
	}

	canPlay() {
		return this.hasSteps() && this.steps > 1
	}

	/** @param {KeyboardEvent} e */
	onKeyDown(e) {
		switch (e.keyCode) {
			case 37: // left
				if (this.hasSteps())
					this.setStep((this.step + this.steps - 1) % this.steps)
				break
			case 39:// right
				if (this.hasSteps())
					this.setStep((this.step + 1) % this.steps)
				break
			case 38: // up
				if (this.hasSteps())
					this.setStep(this.steps - 1)
				break;
			case 40: //down
				if (this.hasSteps())
					this.setStep(0)
				break
			case 32: // space
				if (this.canPlay())
					this.togglePlaying()
				break
			default:
				return
		}
		e.preventDefault()
	}

	dispose() {
		this.stopMouseTracking()
		this.trackbar.removeEventListener("mousedown", this.mouseDownHandler)
		this.play.removeEventListener("click", this.playClickHandler)
	}

}