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
from datetime import datetime

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
  empid_rule = re.compile(r'[0-9]+(?!\s\t)')
  first_rule = re.compile(r'[a-z]+(?!\s\t)',re.IGNORECASE)
  last_rule = re.compile(r'[a-z]+(?=\t[0-9])',re.IGNORECASE)
  ts_start_rule = re.compile(r'[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}')
  ts_end_rule = re.compile(r'(?<=[0-9-]\s)[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:59')
  position_rule = re.compile(r'(?<=:[0-9]{2}\t)[a-z\s:,.+_-]+(?=\s:)',re.IGNORECASE)
  org_rule = re.compile(r'(?<=[A-Z\s\t]:\s)[a-z\s:,.+_-]+(?=\t[a-z]+\t[0-9]{4})',re.IGNORECASE)
  netid_rule = re.compile(r'(?<=[a-zA-Z0-9:-_]\s)[a-z]+(?=\s[0-9\-](.*?)\s[0-9]+\.[0-9]+)')
  punch_in_rule = re.compile(r'[0-9-]+\s[0-9:-]+(?=\s[0-9-]+\s[0-9:-]+\s[0-9]+\.[0-9]+)')
  punch_out_rule = re.compile(r'[0-9-]+\s[0-9:-]+(?=\s[0-9]+\.[0-9]+)')
  hours_rule = re.compile(r'[0-9]+\.[0-9]+')

  # Holds the # of inserted entries
  insertCnt = db[args.collection].count()

  employees = []
  timesheets = []
  next(file) # skip the header line
  for line in file:
    # grab the employee data
    empid = empid_rule.match(line).group(0)
    first = first_rule.search(line).group(0)
    last = last_rule.search(line).group(0)
    ts_start = datetime.strptime(ts_start_rule.search(line).group(0), '%Y-%m-%d %H:%M:%S')
    ts_end = datetime.strptime(ts_end_rule.search(line).group(0), '%Y-%m-%d %H:%M:%S')
    position = position_rule.search(line).group(0)
    organization = org_rule.search(line).group(0)
    netid = netid_rule.search(line).group(0)
    punch_in = datetime.strptime(punch_in_rule.search(line).group(0), '%Y-%m-%d %H:%M:%S')
    punch_out = datetime.strptime(punch_out_rule.search(line).group(0), '%Y-%m-%d %H:%M:%S')
    hours = float(hours_rule.search(line).group(0))

    employee = {
      "netid": netid,
      "empid": empid,
      "firstname": first,
      "lastname": last
    }
    
    org = {
      "orgname": organization,
      "position": position
    }

    timesheet = {
      "owner": netid,
      "start": ts_start,
      "end": ts_end,
      "total_hours": hours,
    }

    timesheet_item = {
      "punch_in": punch_in,
      "punch_out": punch_out
    }

    
    # handle employee
    if len(employees) == 0:
      # just insert the employee
      employees.append(employee)
    else:
      # only insert employee if it was different than before
      i = len(employees)-1
      if employee['netid'] != employees[i]:
        employees.append(employee)

    # handle timesheet
    if len(timesheets) == 0:
      # just insert timesheet
      org['timesheet_items'] = [timesheet_item]
      timesheet['orgs'] = [org]
      timesheets.append(timesheet)
    else:
      i = len(timesheets)-1
      # check if timesheet exists
      if timesheet['owner'] == timesheets[i]['owner'] and timesheet['end'] == timesheets[i]['end']:
        # check if org already exists
        orgfound = False
        for orgidx, org in enumerate(timesheets[i]['orgs']):
          if org['orgname'] == organization:
            orgfound = True
            timesheets[i]['orgs'][orgidx]['timesheet_items'].append(timesheet_item)
        if not orgfound:
          org['timesheet_items'] = [timesheet_item]
          timesheets[i]['orgs'] = [org]
      else:
        # if timesheet doesn't exist just insert it
        org['timesheet_items'] = [timesheet_item]
        timesheet['orgs'] = [org]
        timesheets.append(timesheet)


  # Holds the # of inserted entries
  insertCnt = db[args.collection].count()
  for employee in employees:
    try: # Exception handling
      db['users'].insert(employee) # Insert record into timesheets collection
    except WriteError:
      logging.debug( "Bad input record in line: " + line + '\n')
      continue

  for timesheet in timesheets:
    try: # Exception handling
       db['timesheets'].insert(timesheet) # Insert record into timesheets collection
    except WriteError:
      logging.debug( "Bad input record in line: " + line + '\n')
      continue

  # Number of inserted items
  insertCnt = db[args.collection].count() - insertCnt
  logging.info( '%s:%s' % (insertCnt, " new entries.") )

  # Close file
  file.close()

if __name__ == '__main__':
    begin = datetime.now()
    main()
    end = datetime.now()
    delta = end - begin
    print delta.total_seconds()