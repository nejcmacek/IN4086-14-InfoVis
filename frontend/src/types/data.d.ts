interface Airport {
	code: string
	name: string
	lat: number
	long: number
	city: string
	state: string
	runways: number
	element?: HTMLElement
	delay?: number
}

type Airports = Airport[]

interface AirportMap {
	[code: string]: Airport
}
