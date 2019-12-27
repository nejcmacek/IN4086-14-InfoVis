interface TrackbarOptions {
	steps?: number
	labels?: string[]
	items?: any[]
	step?: number
	value?: number
	playDelay?: number
}

interface TrackbarEvent {
	value: number
	step: number
	item: string | null
	labels: string | null
}

type TrackbarEventHandler<T> = (this: T, e: TrackbarEvent) => void
