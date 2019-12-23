/**
 * @template T
 * @param {T} previous
 * @param {T} next
 */
export function reduceSum(previous, next) {
	return previous + next
}

/**
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

export const waitTimeout = num => new Promise(resolve => setTimeout(resolve, num))

/** @returns {Promise<number>} */
export const waitAnimationFrame = () => new Promise(requestAnimationFrame)

/** @returns {Promise<[number, number]>} */
export const waitAnimationFrameRelativeTime = () => {
	const start = performance.now()
	return new Promise(resolve =>
		requestAnimationFrame(time => {
			const pn = performance.now()
			resolve([performance.now() - start, time, pn])
		})
	)
}

export async function* animationFrameLoop() {
	for (; ;)
		yield await new Promise(requestAnimationFrame)
}

/** @returns {AsyncGenerator<[number, number, number, number]>} */
export async function* animationFrameLoopRelativeTime() {
	const startAbsolute = performance.now()
	let start = -1
	for (; ;)
		yield await new Promise(resolve =>
			requestAnimationFrame(time => {
				if (start === -1)
					start = time
				const pn = performance.now()
				resolve([pn - startAbsolute, time - start, time, pn])
			})
		)
}
