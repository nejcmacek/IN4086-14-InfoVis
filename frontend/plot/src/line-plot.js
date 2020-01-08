/**
 * Renders the "Delay Type" line plot.
 * @param {HTMLElement} holder a wrapper of the SVG element
 * @param {SVGElement} svgElement the svg element the plot is to be rendered onto
 * @param {AirportDelayTypes[]} delays 
 * @param {Margins} margin
 */
export default function makeLinePlot(holder, svgElement, delays, margin) {
	// get available area size
	const viewWidth = holder.clientWidth;
	const viewHeight = holder.clientHeight;

	// plot size
	const width = viewWidth - margin.left - margin.right;
	const height = viewHeight - margin.top - margin.bottom;

	// init the SVG element
	const svg = d3.select(svgElement)
		.attr("width", viewWidth)
		.attr("height", viewHeight)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	/** Draws the line plot */
	function drawLinePlot() {
		const data = delays;

		// Create the axes

		const x = d3.scalePoint()
			.domain(data.map(a => a.time))
			.range([0, width]);
		const y = d3.scaleLinear()
			.domain([0, d3.max(data, function (d) { return +d.total_delay; })])
			.range([height, 0]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.attr("class", "axis")
			.call(d3.axisBottom(x));

		svg.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y));

		// create the lines

		// -> arrival delay
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.style("transform", "translate(1px, 2px)")
			.attr("d", d3.line()
				.x(function (d) { return x(d.time) })
				.y(function (d) { return y(d.arrival_delay) })
			)

		// -> departure delay
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "red")
			.attr("stroke-width", 1.5)
			.style("transform", "translate(1px, 2px)")
			.attr("d", d3.line()
				.x(function (d) { return x(d.time) })
				.y(function (d) { return y(d.departure_delay) })
			)

		// -> total delay
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("stroke-width", 1.5)
			.style("transform", "translate(1px, 2px)")
			.attr("d", d3.line()
				.x(function (d) { return x(d.time) })
				.y(function (d) { return y(d.total_delay) })
			)

		// Create labels

		// -> Y axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.attr("class", "axis-title")
			.style("text-anchor", "middle")
			.text("Delay (in minutes)");

		// -> arrival delay
		svg.append("text")
			.attr("transform", "translate(" + (width + 16) + "," + y(data[data.length - 1].arrival_delay) + ")")
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.style("fill", "steelblue")
			.attr("class", "legend-item")
			.text("Arrival delay");

		// -> departure delay
		svg.append("text")
			.attr("transform", "translate(" + (width + 16) + "," + y(data[data.length - 1].departure_delay) + ")")
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.style("fill", "red")
			.attr("class", "legend-item")
			.text("Departure delay");

		// -> total delay
		svg.append("text")
			.attr("transform", "translate(" + (width + 16) + "," + y(data[data.length - 1].total_delay) + ")")
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.style("fill", "green")
			.attr("class", "legend-item")
			.text("Total delay");
	}

	drawLinePlot(); // draw
}
