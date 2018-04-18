"""Bandkend part in python covered here."""

import json
import gramex
import pandas as pd


def process_data(handler):
	"""Hanlde the captured data and stores it in log for processing."""
	stage = handler.get_argument('stage')
	conf = {
		'bin': {'fields' : ['pax-name','bag-weight','seat-no','bag-size','binno'], 
				'file' : 'baggage.csv'}
	}
	tmp_str = ''
	for item in conf[stage]['fields']:
		val_ = handler.get_argument(item, 'NA')
		tmp_str +=  val_ if val_ != 'undefined' else 'NA'
		tmp_str += ","
	tmp_str = tmp_str[:-1]
	return append_to_data(conf[stage]['file'], tmp_str)


def append_to_data(filename, string_to_append):
	"""Append data to the log file."""
	with open(filename, "a") as r:
		r.write("\n")
		r.write(string_to_append)
	return {'status' : 'true'}
