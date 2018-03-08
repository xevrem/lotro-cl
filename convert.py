#! /usr/bin/env python3
import argparse
import csv

parser = argparse.ArgumentParser()
parser.add_argument('--filename', '-f', help='the name of the csv file to convert to json')
parser.add_argument('--out', '-o', default='out.json', help='filename to output as')
args = parser.parse_args()

with open(args.filename) as csvfile:
  reader = csv.DictReader(csvfile)
  data = []
  for row in reader:
    data.append(row)

import json

js = json.dumps(data)

with open(args.out, 'w') as writer:
  writer.write(js)  