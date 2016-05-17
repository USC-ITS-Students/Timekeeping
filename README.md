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

# License
Please see "license.txt"
