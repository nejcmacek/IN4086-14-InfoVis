/**
 * @template T
 * @param {T} value
 * @param {number} index
 * @param {T[]} array
 */
export function filterUnique(value, index, array) {
	return array.indexOf(value) === index
}

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

/** @returns {Promise<AnimationFrameDetails>} */
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

export async function* animationFrameLoop() {
	for (; ;)
		yield await new Promise(requestAnimationFrame)
}

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
