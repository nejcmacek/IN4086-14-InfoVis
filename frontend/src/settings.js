/** This file contains settings of various parts of the frontend project. */

/** The address of the server. */
export const hostAddress = "http://localhost:5002"

/** The settings used by the Airport Delay screen. */
export const airportsDisplaySettings = {
	maxAirportDelay: 120,
	minAirportCursorDistance: 8,
	focusedAirportRange: 48,
}

/** The settings used by the Flight Delay screen. */
export const flightDisplaySettings = {
	maxFlightDelay: 60,
	flightHistoryPlayDelay: 600, // in milliseconds
	dynamicDisplayHistorySize: 10,
	airportDefaultFillStyle: "#000",
	airportFadedFillStyle: "#444",
	airportRadius: 3,
	flightLineNormalWidth: 3,
	flightLineWideWidth: 6,
	planeImageSize: 32,
	defaultImageRotation: Math.PI / 2,
}

/** The global settings used by all trackbars. */
export const trackbarSettings = {
	cursorSize: 24,
	defaultPlayDelay: 100,
}
