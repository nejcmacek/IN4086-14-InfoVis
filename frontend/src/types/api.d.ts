interface FlightHistory {
	tail_num: string
	op_carrier: string
	FL_DATE: string[]
	ORIGIN: string[]
	DEST: string[]
	DEP_TIME: number[]
	ARR_TIME: number[]
	ARR_DELAY: number[]
	model: string
	year_built: number
	type: string
	passengers: number
	engines: number
	engine_type: string
}

type ResponseFlightHistory = FlightHistory

interface ResponsePlaneList {
	tail_num: string[]
}

interface ResponseAirportList {
	runways: {
		[key: string]: number
	}
	city_name: {
		[key: string]: string
	}
}

interface RequestFlightHistory {
	tail_num: string
}

interface DelayData {
	[number: string]: number
}