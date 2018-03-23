#! /usr/bin/env python3
import argparse
import csv
import io

parser = argparse.ArgumentParser()
parser.add_argument('--filename', '-f', help='the name of the csv file to convert to json')
parser.add_argument('--out', '-o', default='out.json', help='filename to output as')
args = parser.parse_args()

with io.open(args.filename, mode='r', encoding='utf-8') as csvfile:
  reader = csv.DictReader(csvfile)
  data = []
  for row in reader:
    data.append(row)

import json

js = json.dumps(data)

with io.open(args.out, mode='w', encoding='utf-8') as writer:
  writer.write(js)
