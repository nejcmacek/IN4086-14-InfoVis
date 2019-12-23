type TimeUnit = "day" | "month"
type TimeFrame = "single" | "range"
type DisplayType = "day-single" | "day-range" | "month-single" | "month-range"

interface DisplayChangeArgs {
	displayType: DisplayType
	timeFrame: TimeFrame
	timeUnit: TimeUnit
}

interface ValueChangeArgs {
	displayType: DisplayType
	value: string | string[] | null
}
