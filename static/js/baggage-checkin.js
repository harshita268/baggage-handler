/*Baggage checkin simulation goes here.*/

var visualize_checkin = function(obj) {
	var total_width = parseFloat($(obj['selector']).width());
	var placeholder = d3.selectAll(obj['selector']);
	for(i = 0; i < obj.counter_count; i++) {
		placeholder.append('svg')
					.attr('width', (total_width / obj.counter_count) - 10)
					.attr('height', "640")
					.attr('x', i * (total_width / obj.counter_count))
					.attr('y', 40)
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
										.attr('y', '50')
										.attr('width', 135)
										.attr('fill', 'green')
										.attr('height', 20)
		counter_legend.append('text')
										.attr('y', '65')
										.text('Check-in Counter :' + (i +1))
										.style({'font-weight':'bold',
														'fill': '#000'})

		counter.selectAll('g[class="checkin-pass"]')
			.data(d3.range(Math.floor(Math.random() * 50) + 1 )).enter()
			.append('g').attr('class', 'checkin-pass').append('rect')
				.attr('width', "55")
				.attr('x', 30)
				.attr('height', 630. / max_capacity)
				.attr('y', function(d, idx){
					return parseFloat((idx * (620. / max_capacity) * 1.1)+ 74)
					})
				.style('fill', '#123456')
				.attr('stroke-width', '1')
				.attr('stroke-color', '#000')

	})
}