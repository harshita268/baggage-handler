/*Baggage checkin simulation goes here.*/

var _data, _config, _status = 'stop', count = create_time(d3.min(_data, function(c) {
		return c['Time']})) - parseInt(_config[0]['start_before']),
		process_stages = ['checkin', 'xray', 'sorting', 'loading'],
		loop_through = [['pax-name', 'Passenger name'], ['bag-count', 'Baggage count'],
						['bag-weight', 'Baggage weight(Kg)'], ['seat-no', 'Seat no']],
		baggage_allotment = {},
		loading_flag = true,
		last_passenger = _data.filter(function(d){ return d['Time'] == d3.max(_data, function(c) { return c['Time'] }) })
		last_passenger_name = last_passenger[last_passenger.length-1]['Passenger name'],
		last_passenger_baggage_count = last_passenger[last_passenger.length-1]['Baggage count'];

var visualize_checkin = function(count) {
	var tmp = _.filter(_data, function(d){ return d['time_second'] == count })
	tmp.forEach(function(d){
		var counter = 1;
		if($('.counter-1 > div').length == $('.counter-2 > div').length) {
			// TBD and baggage weight
		}
		else if($('.counter-1 > div').length > $('.counter-2 > div').length) {
			counter = 2;
		}
		append_baggage('.counter-' + counter, d, process_stages[0])
		})

	if($('[hide-when="' + count + '"]').length > 0) {
		$('[hide-when="' + count + '"]').each(function(d){
			var x = {}, node = $(this)
			loop_through.forEach(function(dx){
				x[dx[1]] = node.attr(dx[0])
			})
			if(node.attr('stage') == 'checkin') {
				node.remove()
				for(var i=1 ; i <= parseInt(x['Baggage count']); i++) {
					append_baggage('#xray', x, process_stages[1])
				}
			}
			else {
				var tmp_node = node,
					attach_stage = process_stages[process_stages.indexOf(tmp_node.attr('stage')) +1];
				if(attach_stage != undefined) {
					node.remove();
					tmp_node = tmp_node.attr('stage', attach_stage)
					tmp_node = tmp_node.css('background-color', '#123456')
					tmp_node = tmp_node.attr('hide-when', _time_in_checkin_queue(
						'#' + attach_stage, 0, attach_stage)['hide-when'])
					if(attach_stage == 'loading') {
						tmp_node = tmp_node.removeClass('col-md-4')
						tmp_node = tmp_node.addClass('col-md-1')
					}
					// var tmp_d = {};
					// loop_through.forEach(function(_dx){
					// 	tmp_d[_dx[1]] = tmp_node.attr(_dx[0])
					// })
					tmp_node = tmp_node.attr(
						'title', get_baggage_title('#' + attach_stage, x, attach_stage))
					$('#' + attach_stage).append(tmp_node)
				}
				else {
					if($('#loading').find('[pax-name="' + last_passenger_name+ '"]').length == last_passenger_baggage_count) {
						if(loading_flag == true) {
							boarding_start('#loading');
							loading_flag = false;
						}
					}
				}
				$('#' + attach_stage + ' > .passenger').first().css('background-color', 'orange')
			}
		})
	}
	higlight_processing_node();
}



var boarding_start = function(selector) {
	$(selector + ' > .passenger').each(function(d){
	$('#plane2').find('rect[seat-no="' + $(this).attr("seat-no") + '"]').attr(
						'fill', 'orange');
	baggage_loading_start($(this));
	});
	for(x in baggage_allotment) {
		loop_through.forEach(function(d){
			$('.baggage-' + x).attr(d[0], baggage_allotment[x][d[0]])	
		})
		
		$('.baggage-' + x).attr('title', baggage_allotment[x]['seat-no'])
		$('.baggage-' + x).attr('fill', 'orange')
	}
	log_data('baggage')
}

var baggage_loading_start = function(node) {
	/* assign baggage bins and inititate loading */

	var bin_mapping = {
			1: {'row': [1, 8],   'binno': [1, 75]},
			2: {'row': [9, 16],  'binno': [76, 171]},
			3: {'row': [17, 22], 'binno': [172, 259]},
			4: {'row': [23, 30], 'binno': [260, 343]}
		},
		baggage_size2slot_map = {
			'L' : 2,
			'M' : 1,
			'S' : 1,
			'XL': 3
		};
	var seat_map_flag = true, bin_map_flag = true, seat = parseInt(node.attr('seat-no').split('-')[0]);
	for(i=1;i<=4;i++) {
		if(seat >= bin_mapping[i]['row'][0] && seat <= bin_mapping[i]['row'][1]){
			seat_map_flag = false;
			for(ind=bin_mapping[i]['binno'][0];ind <= bin_mapping[i]['binno'][1];ind++) {
				if(baggage_allotment[ind] == undefined) {
					_tmp = {}
					loop_through.forEach(function(l){  
						_tmp[l[0]] = node.attr(l[0])
					})
					baggage_allotment[ind] = _tmp;
					bin_map_flag = false
				}
				if(bin_map_flag == false) {
					break;
				}
			}
		}
		if(seat_map_flag == false) {
			break;
		}
	}
	
}

var log_data = function(mode) {
	if(mode == 'baggage') {
		t_ = ['pax-name','bag-weight','seat-no','bag-size','binno']
		$('#plane1').find('rect').each(function(d){
			var node = $(this), query_str = '';
			t_.forEach(function(_d){
				if(_d == 'binno'){
					query_str += _d + '=' + node.attr('class').split('-')[1]
				}
				else {
					query_str += _d + '=' + node.attr(_d)
				}
				query_str += '&'
			})
			$.get('/data?' + query_str + 'stage=bin', function(d){
			});
		})
	}
}

function higlight_processing_node() {
	$('.counter-1 > .passenger').first().css('background-color', 'orange')
	$('.counter-2 > .passenger').first().css('background-color', 'orange')
	$('#xray > div').first().css('background-color', 'orange')
}


var append_baggage = function(selector, d, stage) {
	var col = stage == 'checkin' ? 'col-md-9': 'col-md-4';
	$(selector).append(
	"<div stage='" + stage + "' pax-name='" + d['Passenger name'] + "' bag-count='" + d['Baggage count'] + "' class='" + col + " passenger' hide-when=" + _time_in_checkin_queue(selector, d['Baggage count'], stage)['hide-when']  +
	" title='"  + get_baggage_title(selector, d, stage) +
	"' bag-weight='" + d['Baggage weight(Kg)']+ "' seat-no='" + d['Seat no'] + "'></div>")
}


var get_baggage_title = function(selector, d, stage) {
	return "PAX :" + d['Passenger name'] +
	"<br/> Bags: " + d['Baggage count'] + " (" + d['Baggage weight(Kg)'] +" Kg)" +
	"<br/> Check-in ETA: " + _time_in_checkin_queue(selector, d['Baggage count'], stage)['checkin-complete']
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
		$('.passenger').remove();
		$('#xray, #sorting, #loading').empty();
		$('#plane2').find('rect').attr('fill', '#123456')
		loading_flag = true;
	}
}

setInterval(timer, 1000);
function timer()
{
  if(status == 'play') {
	count += 1;
	var page = 'departure';
    try {
      page = window.location.href.split('?')[1].split('=')[1]
    }
    catch(e){}
    if(page == 'departure') {
    	visualize_checkin(count)	
    }
    else if(page == 'arrival') {
    	visualize_arrival(count)
    }
	
	$('t').text(create_time_format(count));
  }
}


function create_time_format(count) {
	var measuredTime = new Date(null);
	measuredTime.setSeconds(count); // specify value of SECONDS
	return measuredTime.toISOString().substr(11, 8);
}


function create_time(time) {
	return time.split(':').reduce((acc,time) => (60 * acc) + +time)
}


function _time_in_checkin_queue(queue, bags, stage) {
	var selector, val = 0;
	if(stage == 'checkin') {
		selector = queue + '> .passenger';
		val_ = parseInt(_config[0]['checkin']) + parseInt(bags > 1 ? _config[0]['additional_baggage_time'] * (bags - 1) : 0);
	}
	else {
		selector = queue + ' > .passenger';
		val_ = parseInt(_config[0][stage]);
	}
	var total_pax_in_queue = $(selector).length,
		count_offset = count;
	if(total_pax_in_queue > 0) {
		count_offset = parseInt($(selector).last().attr('hide-when'));
	}
	var hide_when = count_offset + val_;
	return {'hide-when' : hide_when,
			'checkin-complete' : create_time_format(hide_when)
			}
}


/* UI creation */


var add_seats = function() {
	var obj = {
		"seat_size": 6.,
		"max_seats": 180
	}
	var curr_y = 612., curr_x = 215., offset_passage = 0.0, letter_map = {
		1 : 'A',
		2 : 'B',
		3 : 'C',
		4 : 'D',
		5 : 'E',
		6 : 'F'
	}, seat_no = 1;
	var fuselage = d3.selectAll('#plane2 #fuselage');
		fuselage.selectAll('rect')
			.data(d3.range(0, obj.max_seats))
			.enter()
			 .append('rect')
			 .attr("width", obj.seat_size)
			 .attr("class", function(i,d) { return 'seat-' + i })
			 .attr("height", obj.seat_size)
			 .attr("fill", "#555555")
			 .attr("seat-no", function(i, d){
			 	if(i % 6 == 0) {
					seat_no = 1;
				}
				else {
					seat_no += 1;
				}
			 	return (Math.floor(i/6) + 1) + '-' + letter_map[seat_no];
			 })
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
