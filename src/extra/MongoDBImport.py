###            Nikica Trajkovski           ###
###         email: trajkovs@usc.edu        ###
###     ITS Timesheet Historial Project    ###
### MongoDB plain text parser and importer ###

import sys
import argparse
import logging
from datetime import datetime
import re # Regular Expressions
import codecs # UniCode support
import pymongo # For DB Connection
from pymongo.errors import ConnectionFailure, WriteError # For catching exeptions
from pymongo import MongoClient

def main():

  # Process command line arguments
  parser = argparse.ArgumentParser(description='input parameters.')
  parser.add_argument('-d', '--database', dest = 'database', type = str, required = True, help = 'Database name')
  parser.add_argument('-c', '--collection', dest = 'collection', type = str, required = True, help = 'Collection name')
  parser.add_argument('-s', '--host', dest = 'host', type = str, default = 'localhost', help='Server name')
  parser.add_argument('-p', '--port', dest = 'port', type = int, default = 27017, help='Server port')
  parser.add_argument('-f', '--file', dest = 'filename', type = str, required = True, help = 'Input data file')
  args = parser.parse_args()

  # Create a log file
  logging.basicConfig(filename=datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + '.log',level=logging.DEBUG)
  
  # Create a Mongo client istance
  client = MongoClient()
  
  # MongoDB connection
  try:
    client = MongoClient(args.host, args.port) # speicify database parameters
    logging.info("Connected to MongoDB successfully!")
  except ConnectionFailure, e:
    logging.debug("Could not connect to MongoDB: %s" % e)
  
  # Load the database. If doesn't exist Mongo creates it
  db = client[args.database]

  # Open file
  file = codecs.open(args.filename, 'r', encoding='utf-8') # enable UTF-8 encoding

  # Define regex rules
  empid_rule = re.compile(r'[0-9]+\s')
  first_rule = re.compile(r'[a-z]+\s',re.IGNORECASE)
  last_rule = re.compile(r'[a-z]+\s(?=[0-9])',re.IGNORECASE)
  ts_start_rule = re.compile(r'[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\s')
  ts_end_rule = re.compile(r'(?<=[0-9-]\s)[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:59\s')
  org_rule = re.compile(r'(?<=:[0-9]{2}\t)[a-z\s:,.+_-]+(?=\t[a-z]+\t[0-9]{4})',re.IGNORECASE)
  netid_rule = re.compile(r'(?<=[a-zA-Z0-9:-_]\s)[a-z]+(?=\s[0-9\-](.*?)\s[0-9]+\.[0-9]+)')
  punch_in_rule = re.compile(r'[0-9-]+\s[0-9:-]+(?=\s[0-9-]+\s[0-9:-]+\s[0-9]+\.[0-9]+)')
  punch_out_rule = re.compile(r'[0-9-]+\s[0-9:-]+(?=\s[0-9]+\.[0-9]+)')
  hours_rule = re.compile(r'[0-9]+\.[0-9]+')

  # Holds the # of inserted entries
  insertCnt = db[args.collection].count()

  next(file) # skip the header line
  for line in file:
    # grab the employee data
    employee = {
      "empid": empid_rule.match(line).group(0),
      "first": first_rule.search(line).group(0),
      "last": last_rule.search(line).group(0),
      "ts_start": ts_start_rule.search(line).group(0),
      "ts_end": ts_end_rule.search(line).group(0),
      "organization": org_rule.search(line).group(0),
      "netid": netid_rule.search(line).group(0),
      "punch_in": punch_in_rule.search(line).group(0),
      "punch_out": punch_out_rule.search(line).group(0),
      "hours": hours_rule.search(line).group(0)
    }

    # Insert document into DB
    try: # Exception handling
      insertResult = db[args.collection].insert(employee) # Insert record into timesheets collection
    except WriteError:
      logging.debug( "Bad input record in line: " + line + '\n')
      continue

  # Number of inserted items
  insertCnt = db[args.collection].count() - insertCnt
  logging.info( '%s:%s' % (insertCnt, " new entries.") )
  
  # Close file
  file.close()

if __name__ == '__main__':
    main()