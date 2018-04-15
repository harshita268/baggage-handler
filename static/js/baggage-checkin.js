/*Baggage checkin simulation goes here.*/


var _data, _config, _status = 'stop', count = create_time(d3.min(_data, function(c) {
		return c['Time']})) - parseInt(_config[0]['start_before']);
var visualize_checkin = function(count) {
	var tmp = _.filter(_data, function(d){ return d['time_second'] == count })
	tmp.forEach(function(d){
		var counter = 1;
		if($('.counter-1 > div').length == $('.counter-2 > div').length) {
			// TBD
		}
		else if($('.counter-1 > div').length > $('.counter-2 > div').length) {
			counter = 2;
		}
		$('.counter-' + counter).append(
			"<div class='passenger' hide-when=" + _time_in_checkin_queue('.counter-' + counter, d['Baggage count'])  + " title='PAX: " + d['Passenger name'] +
			"\n Bags: " + d['Baggage count'] + " (" + d['Baggage weight(Kg)'] +" Kg)'></div>")
	})
	if(parseInt($('.passenger').attr('hide-when')) == count) {
		$('[hide-when="' + count + '"]').remove()
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
		count = create_time(d3.min(_data, function(c) { return c['Time']})) - parseInt(_config[0]['start_before']);
		$('t').text('__:__:__');
	}
}

setInterval(timer, 1000);
function timer()
{
  if(status == 'play') {
	count += 1;
	visualize_checkin(count)
	var measuredTime = new Date(null);
	measuredTime.setSeconds(count); // specify value of SECONDS
	var MHSTime = measuredTime.toISOString().substr(11, 8);
	$('t').text(MHSTime);
  }
}

function create_time(time) {
	return time.split(':').reduce((acc,time) => (60 * acc) + +time)
}

function _time_in_checkin_queue(queue, bags) {
	var total_pax_in_queue = $(queue + '> .passenger').length,
		count_offset = count;

	if(total_pax_in_queue > 0) {
		count_offset = parseInt($(queue + '> .passenger').last().attr('hide-when'));
	}

	return count_offset + parseInt(_config[0]['checkin_time']) + parseInt(bags > 1 ? _config[0]['additional_baggage_time'] * (bags - 1) : 0)
}