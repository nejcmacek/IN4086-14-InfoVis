var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;

var margin = {top: 100, right: 200, bottom: 100, left: 40};
var width = viewWidth - margin.left - margin.right;
var height = viewHeight - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function drawStackedplot() {
    var data = plane_data.delays;
    var keys = ["carrier_delay", "weather_delay", "nas_delay", "security_delay", "late_aircraft_delay"]

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeSet2);

    var stackedData = d3.stack()
        .keys(keys)
        (data)

    var x = d3.scalePoint()
        .domain(data.map(a => a.time))
        .range([ 0, width ]);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Delay (in minutes)");

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.total; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y))

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")

    var area = d3.area()
        .x(function(d) { return x(d.data.time); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .attr("class", function(d) { return "myArea " + d.key })
          .style("fill", function(d) { return color(d.key); })
          .attr("d", area)

    var size = 20
    svg.selectAll("myrect")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", width+20)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.

    svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", width+20 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
          
}


drawStackedplot();

