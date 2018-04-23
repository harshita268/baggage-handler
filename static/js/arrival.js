/* this is to control all functionality related to the arrival*/

var conveyor_flag = false;
var process_flight_fill = function(){
	/* method responsible for processing baggage and passenger data */
	d3.csv('baggage.csv?v=' + String(new Date()), function(d){
		d.forEach(function(_d, _i){
			for(dkey in _d) {
				$('.baggage-' + _d['binno']).attr(dkey, _d[dkey]);
			} 
			if(_d['seat-no'] != 'NA') {
				[['fill', 'orange'], ['title', get_baggage_title_plane('', _d , '')]].forEach(function(_attr){
					$('.baggage-' + _d['binno']).attr(
						_attr[0], _attr[1]);
					
					$('#plane2').find('rect[seat-no=' + _d['seat-no'] + ']').attr(
						_attr[0], _attr[1]);	
				})
			}
		});
	calculate_hide_when('wagon', d)
	log_data('arrival')
	});
}

var calculate_hide_when = function(stage, d) {
	var sorted_data = _.sortBy(d, function(_d) { return _d['binno'] }),
		half = sorted_data.length / 2;
		sorted_data = _.filter(sorted_data, function(_d) {return _d['seat-no'] != 'NA'}),
		travel_trip_flag = 1,
		offset_time = 0, _f = false;

	sorted_data.forEach(function(_d) {
		if(stage == 'wagon') {
			var baggage_fetch_time = 1;
			if(_config[0]['baggage_opened_door'] == 1) {
				if(parseInt(_d['seat-no']) <= half) {
					offset_time += 1;
				}
				else 
				{	offset_time += 1;
					travel_trip_flag = 3.
				}

				_hide_time = count + (_config[0]['carriage_travel_time'] * travel_trip_flag) + offset_time;
				$('.baggage-' + _d['binno']).attr('hide-when', _hide_time) 
			}
			else {
				if(_f == false) {
					_f = true
					offset_time = 0
				}
				_hide_time = count + (_config[0]['carriage_travel_time'] * travel_trip_flag) + offset_time;
				$('.baggage-' + _d['binno']).attr('hide-when', _hide_time)	
			}
		}
	    var passenger_name = $('.baggage-' + _d['binno']).attr('pax-name');
	    if(passenger_name != 'NA') {
	    	var aad = _.filter(_data, function(d){ return d['Passenger name'] == passenger_name });
	    	if(aad.length > 0) {
	    		msg = 'Dear ' + aad[0]['Passenger name'] + ',\n Your baggage would arrive around ' +
	    				create_time_format(parseInt($('.baggage-' + _d['binno']).attr('hide-when')) + _config[0]['wagon_to_loader_time'] + _config[0]['carriage_travel_time'] + (Math.floor(Math.random() * 6) + 1)) +
			  		    ' Booked for flight ' + aad[0]['Flight no']
				if(String(aad[0]['Contact number']) != 'NA') {
					sms_handler(String(aad[0]['Contact number']), msg)	
				}
	    	}
	    }
	    
	})
}


var visualize_arrival = function(count) {
	var arrival_process_stages = ['wagon', 'loader', 'conveyor'],
		node = $('#plane1 rect[hide-when="' + count + '"]'),
		x = {};
	if($('#plane1 rect[hide-when]').length == $('#wagon div').length) {
		// loader initiate
		node = $('#wagon div');
		var offset = 10;
		node.each(function(){
			var _n = $(this), _t = (parseInt(_n.attr('hide-when')) + offset)
			_n = _n.attr('hide-when',  String(_t))
			offset += 2;
			$(this).remove();
			$('#loader').append(_n);
		})
	}
	else if($('#plane1 rect[hide-when]').length == $('#loader div').length) {
		conveyor_flag = true;
	}
	else {
		if(node.length > 0) {
			node.each(function(_n){
				loop_through.forEach(function(dx){
						x[dx[1]] = node.attr(dx[0])
					})
				if($(this).attr('stage') == undefined) {
					node.attr('fill', 'green');
					append_baggage_arrival('#wagon', x, 'wagon', $(this))
				}
			})
		}		
	}
	if(conveyor_flag == true){
		var node = $('#loader div[hide-when=' + String(count) + ']');
		$('#conveyor').append(node);
		
	}

}


var append_baggage_arrival = function(selector, d, stage, node) {
	var col = 'col-md-1';
	$(selector).append(
	"<div stage='" + stage + "' pax-name='" + d['Passenger name'] + "' bag-count='" + d['Baggage count'] + "' class='" + col + 
	" passenger' hide-when=" + (parseInt(node.attr('hide-when')) + parseInt(_config[0]['wagon_to_loader_time'])) +
	" title='"  + get_baggage_title_arrival(selector, d, stage, node) +
	"' bag-weight='" + d['Baggage weight(Kg)']+ "' seat-no='" + d['Seat no'] + "'></div>")
}


var get_baggage_title_arrival = function(selector, d, stage, node) {
	return "PAX :" + d['Passenger name'] +
	"<br/> Bag Weight: " + d['Baggage weight(Kg)'] + " KG" +
	"<br/> " + stage + " ETA: " + create_time_format(parseInt(node.attr('hide-when')) + parseInt(_config[0]['wagon_to_loader_time']))
}
