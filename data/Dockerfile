FROM node:latest

# create /import folder to dump files
RUN mkdir /import
COPY DataImport.js /import/DataImport.js
COPY earn_summary.csv /import/earn_summary.csv
COPY header.csv /import/header.csv
COPY sanctions.csv /import/sanctions.csv
COPY time.csv /import/time.csv

# Go to /import
WORKDIR /import

# install dependencies
RUN npm install csv-parse
RUN npm install fs
RUN npm install async
RUN npm install q
RUN npm install mongodb
RUN npm install assert
RUN npm install minimist

