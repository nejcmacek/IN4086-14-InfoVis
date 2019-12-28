/**
 * Renders a line plot.
 * @param {HTMLElement} holder a wrapper of the SVG element
 * @param {SVGElement} svgElement the svg element the plot is to be rendered onto
 * @param {AirportDelayTypes[]} delays 
 * @param {Margins} margin
 */
export default function makeStackPlot(holder, svgElement, delays, margin) {
	const viewWidth = holder.clientWidth
	const viewHeight = holder.clientHeight

	const width = viewWidth - margin.left - margin.right;
	const height = viewHeight - margin.top - margin.bottom;

	const size = 20

	const svg = d3.select(svgElement)
		.attr("width", viewWidth)
		.attr("height", viewHeight)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	function drawStackedPlot() {
		const data = delays;
		const keys = ["carrier_delay", "weather_delay", "nas_delay", "security_delay", "late_aircraft_delay"]

		const color = d3.scaleOrdinal()
			.domain(keys)
			.range(d3.schemeSet2);

		const stackedData = d3.stack()
			.keys(keys)
			(data)

		const x = d3.scalePoint()
			.domain(data.map(a => a.time))
			.range([0, width]);

		const xAxis = svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.attr("class", "axis")
			.call(d3.axisBottom(x));

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.attr("class", "axis-title")
			.style("text-anchor", "middle")
			.text("Delay (in minutes)");

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, function (d) { return +d.total_delay; })])
			.range([height, 0]);

		svg.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y))

		const clip = svg.append("defs").append("svg:clipPath")
			.attr("id", "clip")
			.append("svg:rect")
			.attr("width", width)
			.attr("height", height)
			.attr("x", 0)
			.attr("y", 0);

		const areaChart = svg.append('g')
			.attr("clip-path", "url(#clip)")

		const area = d3.area()
			.x(function (d) { return x(d.data.time); })
			.y0(function (d) { return y(d[0]); })
			.y1(function (d) { return y(d[1]); })

		areaChart
			.selectAll("mylayers")
			.data(stackedData)
			.enter()
			.append("path")
			.attr("class", function (d) { return "myArea " + d.key })
			.style("fill", function (d) { return color(d.key); })
			.attr("d", area)
			.style("transform", "translateX(1px)")

		svg.selectAll("myrect")
			.data(keys)
			.enter()
			.append("rect")
			.attr("x", width + 20)
			.attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
			.attr("width", size)
			.attr("height", size)
			.style("fill", function (d) { return color(d) })

		// Add one dot in the legend for each name.
		svg.selectAll("mylabels")
			.data(keys)
			.enter()
			.append("text")
			.attr("x", width + 20 + size * 1.2)
			.attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
			.style("fill", function (d) { return color(d) })
			.text(function (d) { return d })
			.attr("class", "legend-item")
			.attr("text-anchor", "left")
			.style("alignment-baseline", "middle")
	}

	drawStackedPlot();
}
