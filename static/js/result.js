
function create_time_format(count) {
  var measuredTime = new Date(null);
  measuredTime.setSeconds(count); // specify value of SECONDS
  return measuredTime.toISOString().substr(11, 8);
}

function grouped_bar() {
  var svg = d3.select("#bar"),
      margin = {top: 20, right: 20, bottom: 50, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height + 30, 0]);

  var z = d3.scaleOrdinal()
      .range(["#333", "orange"]);

  d3.csv("arrival.csv", function(d, i, columns) {
    //for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    d['index'] = 'B-' + (i+1);
    d['actual_arrival'] = create_time(d['actual_arrival']);
    d['estimated_arrival'] = create_time(d['estimated_arrival'])
    	return d;	
  }, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    x0.domain(data.map(function(d) { return d['index']; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d['index']) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key], 'pax-name': d['pax-name']}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value) + 30; })
        .attr("width", x1.bandwidth())
        .attr("title", function(d) { console.log(d); return 'PAX name : ' + d['pax-name'] +
              "<br/>" + d.key.replace("_", " ") + " : " + create_time_format(d.value); 

          })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + String(parseInt(height) + 30) + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null + 'S'))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Time");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}



function timeline(data) {
  // var testData = [
  //       {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  //       {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
  //       {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
  //     ];
  var testData = data;

      
      var width = 500;
      function timelineRect() {
        var chart = d3.timelines();

        var svg = d3.select("#timeline1").append("svg").attr("width", width)
          .datum(testData).call(chart);
      }

     
      timelineRect();
}