# Timekeeping
Web application designed to review timesheet history.

# Deployment

### Local
- RUN: npm install
- RUN: npm start

### Production
- Install docker and docker-compose
- Setup a mongodb instance and use the data/data-import.js script in order to load the data into the instance.
- Configure server to point to mongodb instance in src/env/index.js
- RUN: docker-compose up -d

# Data import
- File: data/data-import.js
- Help: node data/data-import.js -h

This script requires employee/timesheet data to be in .csv file format. You must also already have a mongodb instance running. By Default the script will import into a locally running mongodb instance. You can change this setting with the -c flag by passing in the connection string to the mongodb instance you want to import to.

# Tests
### Client side
- Ensure Karma is installed globally: npm install -g karma
- RUN: karma start

### Server side
- Ensure Mocha is installed globally: npm install -g mocha
- RUN: mocha src/tests/

# License
Please see "license.txt"
