var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;

var margin = {top: 100, right: 100, bottom: 100, left: 40};
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function drawLineplot() {
    var data = plane_data.delays;

    var x = d3.scalePoint()
        .domain(data.map(a => a.time))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.total; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));


    svg.append("path")
    .datum(data)
    .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.arrival) })
        )

    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.departure) })
        )

    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.total) })
        )

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Delay (in minutes)");

    svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[data.length-1].arrival) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "steelblue")
        .text("Arrival delay");
        
    svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[data.length-1].departure) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "red")
        .text("Departure delay");
        
    svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[data.length-1].total) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "green")
		.text("Total delay");
}


drawLineplot();

