# Timekeeping
Web application designed to review timesheet history.

# Prerequisites
- Node.js 
	- Download and install <a href="https://nodejs.org/en/download/current/">Node.js</a>
- mongodb	
	- Download <a href="https://www.mongodb.com/download-center#community">mongodb</a> 
	- Installation steps: <a href="https://docs.mongodb.com/getting-started/shell/installation/">https://docs.mongodb.com/getting-started/shell/installation/</a>

# Installation	
- Download or clone Timekeeping repository
- Go into project folder
```
cd Timekeeping
```
- Install dependencies:
```
npm install
```

# Data import
- The script requires employee/timesheet data to be in .csv file format
- Run the local mongodb instance
- Go to data folder
```
cd data
```
- Refer the Help Menu for importing the .csv files
```
node data/data-import.js -h
```
- Import the .csv files
  - Example:
```
node data-import.js -f header.csv -e earn_summary.csv -s sanctions.csv -p principal_properties.csv -t time.csv
```
- Check for "Successfully written to the db" message on console after the import

## Note : 
   By default the script will import into a locally running mongodb instance. You can change this setting with the -c flag by passing in the connection string to the mongodb instance you want to import to.

# Deployment

### Local
- RUN: npm start
- Open the browser and navigate to <a href="http://localhost:3000/">http://localhost:3000/</a>
- Enter the credentials

### Production
- Install docker and docker-compose
- Setup a mongodb instance and use the data/data-import.js script in order to load the data into the instance.
- Configure server to point to mongodb instance in src/env/index.js
- RUN: docker-compose up -d

# Tests
### Client side
- Ensure Karma is installed globally: npm install -g karma
- RUN: karma start

### Server side
- Ensure Mocha is installed globally: npm install -g mocha
- RUN: mocha src/tests/

# License
Please see "license.txt"
