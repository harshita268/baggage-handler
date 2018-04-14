/*Baggage checkin simulation goes here.*/

var visualize_checkin = function(obj) {
	var total_width = parseFloat($(obj['selector']).width());
	var placeholder = d3.selectAll(obj['selector']);
	for(i = 0; i < obj.counter_count; i++) {
		placeholder.append('svg')
					.attr('width', (total_width / obj.counter_count) - 10)
					.attr('height', "640")
					.attr('x', i * (total_width / obj.counter_count))
					.attr('y', 0)
					.attr('asset', 'counter-' + i)
	}
	process_queue('counter-')
}

var process_queue = function(selector) {
	var max_capacity = 50;
	$("[asset*='" + selector + "']").each(function(i, d){
		var counter = d3.selectAll("[asset='counter-" + i + "']");
		var counter_legend = counter.append('g')

		counter_legend.append('rect')
						.attr('y', '0')
						.attr('width', 80)
						.attr('fill', 'green')
						.attr('height', 20)
		counter_legend.append('text')
						.attr('y', '15')
						.attr('x', '2')
						.text('Check-in :' + (i +1))
						.style({'font-weight':'bold',
										'fill': '#000'})
		var y_pos = 8;
		counter.selectAll('g[class="checkin-pass"]')
			.data(d3.range(Math.floor(Math.random() * 50) + 1 )).enter()
			.append('g').attr('class', 'checkin-pass').append('rect')
				.attr('width', "55")
				.attr('x', 10)
				.attr('height', (550. - (max_capacity * 1.)) / max_capacity)
				.attr('y', function(idx, d){
					y_pos += (5.2 + ((560. - (max_capacity * 5.)) / max_capacity));
					return parseFloat(idx == 0 ? 20:y_pos);

					})
				.style('fill', '#123456')
				.attr('stroke-width', '1')
				.attr('stroke-color', '#000')

	})
}

var baggage_scanner = function() {

}

var add_seats = function() {
	var obj = {
		"seat_size": 6.,
		"max_seats": 180
	}
	var curr_y = 612., curr_x = 215., offset_passage = 0.0;
	var fuselage = d3.selectAll('#plane2 #fuselage');
		fuselage.selectAll('rect')
			.data(d3.range(0, obj.max_seats))
			.enter()
			 .append('rect')
			 .attr("width", obj.seat_size)
			 .attr("class", function(i,d) { return 'seat-' + i })
			 .attr("height", obj.seat_size)
			 .attr("fill", "#123")
			 .attr("x", function(i, d) {
				if(i % 3 == 0) {
				 	offset_passage = 10.;
				}
				if(i % 6 == 0) {
					offset_passage = 0.0
				}
			 	return curr_x + offset_passage + ((i % 6) * obj.seat_size)
			 })
			 .attr("y", function(i, d) {
			 	if(i % 6 == 0) {
			 		curr_y += 9.3;
			 		curr_x = 215.;
			 	}

				 	return curr_y;
			})
}