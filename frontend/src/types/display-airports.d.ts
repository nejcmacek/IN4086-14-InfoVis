interface CacheDelayData {
	[key: string]: CacheDelayDataItem
}

interface CacheDelayDataItem {
	loading: boolean
	promise: Promise<DelayData> | null
	data: DelayData | null
}

