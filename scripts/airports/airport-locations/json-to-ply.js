const fs = require("fs")
const args = process.argv.slice(2)
const inFile = args[0] || "./airports.json"
const outFile = args[1] || "./points.ply"

const airports = require(inFile)
const points = airports.map(t => `${t.lat} ${t.long} 0`)
const content = `ply
format ascii 1.0
element vertex ${points.length}
property float x
property float y
property float z
element face 0
property list uchar uint vertex_indices
end_header
${points.join("\n")}
`

fs.writeFileSync(outFile, content)
