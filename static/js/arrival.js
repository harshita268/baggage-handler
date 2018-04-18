/* this is to control all functionality related to the arrival*/


var process_flight_fill = function(){
	/* method responsible for processing baggage and passenger data */
	d3.csv('baggage.csv?v=' + String(new Date()), function(d){
		d.forEach(function(_d, _i){
			for(dkey in _d) {
				$('.baggage-' + _d['binno']).attr(dkey, _d[dkey]);
			} 
			if(_d['seat-no'] != 'NA') {
				[['fill', 'orange'], ['title', _d['seat-no']]].forEach(function(_attr){
					$('.baggage-' + _d['binno']).attr(
						_attr[0], _attr[1]);
					
					$('#plane2').find('rect[seat-no=' + _d['seat-no'] + ']').attr(
						_attr[0], _attr[1]);	
				})
			}
		});
	calculate_hide_when('wagon', d)
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
	})
	
	return 'vinay'
}