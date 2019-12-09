const airports = require("../airport-codes/airports-50states.json")
const res = airports
	.filter(t => t.state === "AK")
	// .reduce((p, n) => n.lat > p.lat ? n : p)

console.log(res)
