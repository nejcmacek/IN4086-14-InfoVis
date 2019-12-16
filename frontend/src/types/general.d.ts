interface Size {
	height: number
	width: number
}

type Status<T> = {
	code: "loading"
	promise: Promise<T>
} | {
	code: "success"
	data: T
} | {
	code: "idle"
} | {
	code: "error"
	error: Error
	message: "string"
}
