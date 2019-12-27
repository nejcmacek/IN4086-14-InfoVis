type DisplayDynamics = "static" | "dynamic"

interface PlaneDataMapping {
	[plane: string]: CacheItem<PlaneData>
}

interface PlaneData {
	carrier: string
	tailNumber: string
	model: string
	passengers: number | string
	engineType: string
	engines: number | string
	type: string
	schedule: PlaneSchedule
}

interface Flight {
	date: string
	arrivalTime: number
	arrivalDelay: number
	departureTime: number
	origin: Airport
	destination: Airport
}

interface PlaneSchedule {
	[date: string]: Flight[]
}

interface PlaneDrawData {
	current: Flight
	history: Flight[]
	time: number
}
