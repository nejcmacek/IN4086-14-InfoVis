/** This class implements emitting of events and registering event listeners. */
export default class EventListener {

	constructor() {
		this.listeners = {}
	}

	addEventListener(name, listener) {
		if (!(name in this.listeners))
			this.listeners[name] = []

		const arr = this.listeners[name]
		if (!arr.includes(listener))
			arr.push(listener)
	}

	removeEventListener(name, listener) {
		if (name in this.listeners) {
			const arr = this.listeners[name]
			const index = arr.indexOf(listener)
			if (index >= 0)
				arr.splice(index, 1)
		}
	}

	emit(name, arg) {
		const arr = this.listeners[name] || []
		for (const listener of arr)
			listener.call(this, arg)
	}

}
