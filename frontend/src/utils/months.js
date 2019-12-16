export const monthValues = [
	"may", // 2018
	"june", // 2018
	"july", // 2018
	"august", // 2018
	"september", // 2018
	"october", // 2018
	"november", // 2018
	"december", // 2018
	"january",  // 2019
	"february", // 2019
	"march", // 2019
	"april", // 2019
]

export const monthDisplayStrings = [
	"May 2018",
	"June 2018",
	"July 2018",
	"August 2018",
	"September 2018",
	"October 2018",
	"November 2018",
	"December 2018",
	"January 2019",
	"February 2019",
	"March 2019",
	"April 2019",
]

export function getMonthIndex(m) {
	return monthValues.indexOf(m)
}

export function getMonthDisplayString(m) {
	return monthDisplayStrings[getMonthIndex(m)]
}

export function compareMonths(a, b) {
	return getMonthIndex(a) - getMonthIndex(b)
}

export function countMonthsInBetween(start, end) {
	const s = monthValues.indexOf(start)
	const e = monthValues.indexOf(end)
	return e - s + 1
}

export function getMonthsInBetween(start, end) {
	const s = monthValues.indexOf(start)
	const e = monthValues.indexOf(end)
	return monthValues.slice(s, e + 1)
}

export function getMonthsDisplayStringsInBetween(start, end) {
	const s = monthValues.indexOf(start)
	const e = monthValues.indexOf(end)
	return monthDisplayStrings.slice(s, e + 1)
}
