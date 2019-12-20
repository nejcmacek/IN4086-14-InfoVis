export function compareDateStrings(a, b) {
	return a.localeCompare(b)
}

export function dateStringToNumberArray(s) {
	return s.split("-").map(Number)
}

export function toDate(dateString) {
	return new Date(dateString)
}

/** @param {Date} date */
export function toDateString(date) {
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, "0")
	const day = date.getDate().toString().padStart(2, "0")
	return `${year}-${month}-${day}`
}

export function getDatesInBetween(a, b) {
	const start = new Date(a).getTime()
	const end = new Date(b).getTime()
	const day = 1000 * 60 * 60 * 24
	const count = (end - start) / day + 1
	const dates = new Array(count)

	for (let i = 0; i < count; i++)
		dates[i] = toDateString(new Date(start + i * day))

	return dates
}

export function invertDateString(dateString) {
	return dateString.split("-").reverse().join("-")
}
