/*Baggage checkin simulation goes here.*/


var _data, _status = 'stop', count = create_default_time();
var visualize_checkin = function(obj) {
	for(var i=0;i<50;i++){
		$('.counter-1').append(
			"<div class='passenger' title='passenger " + (i+1) + "'></div>")
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
			 .attr("fill", "#555555")
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
	$.get('static/svg/baggage.txt', function(d){
		d3.select('#plane1 #fuselage')
			.html(d)
	})
}


var conveyor = function() {

}


var _click_handlers = function(node) {
	status = node.attr('status');
	if(status == 'play') {
		node.removeClass('glyphicon-play');
		node.addClass('glyphicon-pause');
		node.attr('status', 'pause')
		$('.glyphicon-stop').removeClass('disabled', 'false')
	}
	else if(status == 'pause') {
		node.removeClass('glyphicon-pause');
		node.addClass('glyphicon-play');
		node.attr('status', 'play')
		$('.glyphicon-stop').removeClass('disabled', 'false')
	}
	else if(status == 'stop') {
		$('.glyphicon-stop').addClass('disabled', 'true')
		$('.glyphicon-pause, .glyphicon-play').removeClass('glyphicon-play')
		$('.glyphicon-pause, .glyphicon-play').removeClass('glyphicon-pause')
		$('.glyphicon').eq(0).addClass('glyphicon-play')
		$('.glyphicon').eq(0).attr('status', 'play')
		count = create_default_time()
		$('t').text('__:__:__');
	}
}

setInterval(myMethod, 1000);
function myMethod()
{
  if(status == 'play') {
	count += 1;
	var measuredTime = new Date(null);
	measuredTime.setSeconds(count); // specify value of SECONDS
	var MHSTime = measuredTime.toISOString().substr(11, 8);
	$('t').text(MHSTime);
  }
}

function create_default_time() {
	return d3.min(_data, function(c) { return c['Time'] }).split(':').reduce((acc,time) => (60 * acc) + +time)
}