#! /usr/bin/env python3
'''
Copyright 2018 Erika Jonell

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''

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
