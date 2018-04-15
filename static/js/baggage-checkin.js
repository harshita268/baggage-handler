/*Baggage checkin simulation goes here.*/

var visualize_checkin = function(obj) {
	for(var i=0;i<50;i++){
		$('.counter-1').append("<div class='passenger' title='passenger " + (i+1) + "'></div>")
		$('.counter-2').append("<div class='passenger' title='passenger " + (i+1) + "'></div>")
	}
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

var add_baggage_bins = function() {
	// 	var obj = {
	// 	"seat_size": 5.6,
	// 	"max_seats": 384
	// }
	// var bins = {
	// 	"0" : '#123',
	// 	"1" : '#ccc',
	// 	"2" : "#555",
	// 	"3" : "#333"
	// }
	// var curr_y = 612., curr_x = 215., offset_passage = 0.0, bin = 0;
	// var fuselage = d3.selectAll('#plane1 #fuselage');
	// 	fuselage.selectAll('rect')
	// 		.data(d3.range(0, obj.max_seats))
	// 		.enter()
	// 		 .append('rect')
	// 		 .attr("width", obj.seat_size)
	// 		 .attr("class", function(i,d) { return 'seat-' + i })
	// 		 .attr("height", obj.seat_size)
	// 		 .attr("fill", function(d){
	// 		 		bin = Math.floor(d / 96)
	// 		 		return bins[bin]
	// 		 	})
	// 		 .attr("x", function(i, d) {
	// 			if(i % 4 == 0) {
	// 			 	offset_passage = 2.;
	// 			}
	// 			if(i % 8 == 0) {
	// 				offset_passage = 0.0
	// 			}
	// 		 	return curr_x + offset_passage + ((i % 8) * obj.seat_size)
	// 		 })
	// 		 .attr("y", function(i, d) {
	// 		 	if(i % 8 == 0) {
	// 		 		curr_y += obj.seat_size + 0.3;
	// 		 		//curr_x = 215.;
	// 		 	}

	// 			return curr_y;
	// 		})
	$.get('static/svg/baggage.txt', function(d){
		d3.select('#plane1 #fuselage')
			.html(d)
	})
}


var conveyor = function() {

}