const args = process.argv.slice(2)
const inFile = args[0] || "./airports.json"
const outFile = args[1] || "./out.csv"

const data = require(inFile)
let d = data.map(t => `${t.code},${t.long},${t.lat}`).join("\n")
d = "code,long,lat\n" + d

require("fs").writeFileSync(outFile, d)
console.log("written " + data.length + " airports to " + outFile)
