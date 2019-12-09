const fs = require("fs")

let content = ""
const items = [
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-05.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-06.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-07.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-08.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-09.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-10.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-11.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2018-12.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-01.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-02.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-03.csv",
	"B:/Documents/TUDelft/Courses/Data Visualization/Projects/InfoVis/database/raw/flights/flights-2019-04.csv",
]

for (let i = 0; i < items.length; i++) {
	console.log("processing: " + (i + 1));
	const file = items[i]
	const c = fs.readFileSync(file, { encoding: "utf8" })
	if (i == 0)
		content = c
	else {
		const ind = c.indexOf("\n")
		const cc = c.substr(ind + 1)
		content += cc
	}
	console.log(content.length)
}

fs.writeFileSync("all-flights.csv", content)
console.log("done");