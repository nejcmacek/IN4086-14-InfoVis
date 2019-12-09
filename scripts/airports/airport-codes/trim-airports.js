const noStates = []
const onlyStates = ["PR", "TT", "VI"]

const args = process.argv.slice(2)
const outFile = args[0] || "./out.json"
const aFile = args[1] || "./airports.json"

const data = require(aFile)
const trimmed = data.filter(t => {
	const state = t.state
	if (noStates.includes(state))
		return false
	if (onlyStates)
		return onlyStates.includes(state)
	else
		return true
})

const content = JSON.stringify(trimmed)
require("fs").writeFileSync(outFile, content)
console.log(trimmed.length + " airports written to " + outFile)
