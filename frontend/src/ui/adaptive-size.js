/** @type {Map<HTMLElement, HTMLElement[]>} */
let holders;
const sizableTags = ["IMG", "CANVAS", "SVG"]
const imgAspectRatio = 960 / 600
const listeners = {}

export function findElements() {
	holders = new Map()
	const asHolders = document.getElementsByClassName("adaptive-size-holder")
	for (const h of asHolders) {
		const list = []
		for (const c of h.children) {
			if (c.classList.contains("adaptive-size"))
				list.push(c)
		}
		if (list.length)
			holders.set(h, list)
	}
}

/**
 * @param {string} name
 * @param {(newSize: Size) => void} listener
 */
export function registerListener(name, listener) {
	listeners[name] = listener
}

export function rescale() {
	for (const [holder, elements] of holders.entries()) {
		const heightHolder = holder.clientHeight
		const widthHolder = holder.clientWidth

		const aspectHolder = widthHolder / heightHolder
		const aspectImage = imgAspectRatio

		let heightItem;
		let widthItem;

		if (aspectHolder >= aspectImage) {
			// height is the same
			heightItem = heightHolder
			widthItem = heightItem * aspectImage
		} else {
			widthItem = widthHolder
			heightItem = widthItem / aspectImage
		}

		for (const elt of elements) {
			if (sizableTags.includes(elt.tagName)) {
				elt.height = heightItem
				elt.width = widthItem
			} else {
				elt.style.height = `${heightItem}px`
				elt.style.width = `${widthItem}px`
			}
			const listenerAttr = elt.attributes.getNamedItem("resize-listener")
			if (listenerAttr) {
				const listenerName = listenerAttr.value
				const listener = listeners[listenerName]
				if (listener)
					listener({ height: heightItem, width: widthItem })
		}
		}

	}
}

export function init() {
	findElements()
	rescale()
	window.addEventListener("resize", rescale)
}
