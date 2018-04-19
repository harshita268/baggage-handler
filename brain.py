"""Bandkend part in python covered here."""

import os
import json
import gramex
import pandas as pd


def process_data(handler):
	"""Hanlde the captured data and stores it in log for processing."""
	stage = handler.get_argument('stage')
	conf = {
		'bin': {'fields' : ['pax-name','bag-weight','seat-no','bag-size','binno', 'sms', 'loading'], 
				'file' : 'baggage.csv'},
		'arrival' : {'fields' : ['pax_name', 'actual_arrival', 'estimated_arrival'],
				'file' : 'arrival.csv'}
	}
	tmp_str = ''
	for item in conf[stage]['fields']:
		val_ = handler.get_argument(item, 'NA')
		tmp_str +=  val_ if val_ != 'undefined' else 'NA'
		tmp_str += ","
	tmp_str = tmp_str[:-1]
	print(handler, conf[stage]['file'], tmp_str, "***********")
	return append_to_data(handler, conf[stage]['file'], tmp_str, stage)


def append_to_data(handler, filename, string_to_append, stage):
	"""Append data to the log file."""
	mode = handler.get_argument('filemode')
	if mode == 'Y':
		os.remove(filename);
	with open(filename, "a") as r:
		if mode == 'Y':
			if stage == 'bin':
				r.write("pax-name,bag-weight,seat-no,bag-size,binno,sms,loading")
			else:
				r.write("pax-name,actual_arrival,estimated_arrival")
		r.write("\n")
		r.write(string_to_append)
	return {'status' : 'true'}
