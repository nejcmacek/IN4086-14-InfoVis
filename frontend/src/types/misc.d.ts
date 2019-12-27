interface Size {
	height: number
	width: number
}

interface CacheItem<T> {
	loading: boolean
	promise: Promise<T> | null
	data: T | null
}

interface AnimationFrameDetails {
	delta: number
	start: number
	now: number
	diff: number
}


interface AnimationFrameLoopDetails {
	delta: number
	start: number
	now: number
	diff: number
	count: number
	step: number
}
