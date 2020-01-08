/**
 * This file offers many miscellaneous heleper functions.
 */

/**
 * Opens a new tab (window) with the airport delay plots.
 * @param {string} airport Airport code
 * @param {string} time Date or month
 */
export function showAirportDelayPlot(airport, start, end) {
	return window.open(`plot/index.html?airport=${airport}&start=${start}&end=${end}`)
}

/** Empties an HTML element.
 * @param {HTMLElement} element 
 */
export function emptyElement(element) {
	while (element.firstChild)
		element.firstChild.remove()
}

/**
 * Filters an array of unique values. Usage: [].filter(filterUnique)
 * @template T
 * @param {T} value
 * @param {number} index
 * @param {T[]} array
 */
export function filterUnique(value, index, array) {
	return array.indexOf(value) === index
}

/**
 * Reduces an array to its sum.
 * @template T
 * @param {T} previous
 * @param {T} next
 */
export function reduceSum(previous, next) {
	return previous + next
}

/**
 * Reduces an array to its average numerical value.
 * @template T
 * @param {T} previous
 * @param {T} next
 * @param {number} index
 * @param {T[]} array
 */
export function reduceAverage(previous, next, index, array) {
	if (index === 0) {
		return array[0]
	} else if (index === 1) {
		return (previous + next) / array.length
	} else {
		return previous + (next / array.length)
	}
}

/** Creates a promise that resolves after a specified time. */
export const waitTimeout = num => new Promise(resolve => setTimeout(resolve, num))

/** 
 * Creates a promise that resolves when the next frame is rendered.
 * @returns {Promise<number>} 
 */
export const waitAnimationFrame = () => new Promise(requestAnimationFrame)

/** 
 * Creates a promise that resolves when the next frame is rendered. Some extra details are provided.
 * @returns {Promise<AnimationFrameDetails>} 
 */
export const waitAnimationFrameDetailed = () => {
	const start = performance.now()
	return new Promise(resolve =>
		requestAnimationFrame(delta => {
			const now = performance.now()
			resolve({
				delta,
				start,
				now,
				diff: now - start,
			})
		})
	)
}

/**
 * Creates a generator that yields promises which resolve 
 * when the next animation frame is to be rendered.
 */
export async function* animationFrameLoop() {
	for (; ;)
		yield await new Promise(requestAnimationFrame)
}

/**
 * Creates a generator that yields promises which resolve when the next animation frame
 * is to be rendered. Additional information is provided and the generator can be cancelled.
 */
export function animationFrameLoopDetailed() {
	let id = NaN
	let reject = null
	return {
		get animationFrameID() {
			return id
		},
		cancel() {
			if (!isNaN(id)) { // check if we've started
				cancelAnimationFrame(id)
				reject()
			}
		},
		/** @returns {AsyncGenerator<AnimationFrameLoopDetails>} */
		[Symbol.asyncIterator]: async function* () {
			if (!isNaN(id))
				throw new Error("Already started.")

			const start = performance.now()
			let count = -1
			let previous = start

			for (; ;) {
				const promise = new Promise(resolve => {
					reject = () => resolve(null)
					id = requestAnimationFrame(delta => {
						const now = performance.now()
						const step = now - previous
						const diff = now - start
						previous = now
						count++
						resolve({
							delta,
							start,
							now,
							diff,
							count,
							step,
						})
					})
				})

				const res = await promise
				if (res)
					yield res
				else
					return
			}
		},
	}

}
