#! /usr/bin/env python3

import csv

with open('eriador_test.csv') as csvfile:
  reader = csv.DictReader(csvfile)
  data = []
  for row in reader:
    data.append(row)

import json

js = json.dumps(data)

with open('eriador.json', 'w') as writer:
  writer.write(js)  