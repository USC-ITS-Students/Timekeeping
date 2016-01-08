# install and start mongodb
#FROM mongo:latest

FROM node

# create /import folder to dump files
RUN mkdir /import
COPY DataImport.js /import/DataImport.js
COPY earn_summary.csv /import/earn_summary.csv
COPY header.csv /import/header.csv
COPY sanctions.csv /import/sanctions.csv
COPY time.csv /import/time.csv
COPY ../package.json /import/package.json

# Go to /import
WORKDIR /import

# install dependencies
RUN npm install csv-parse
RUN npp install fs
RUN npp install async
RUN npp install q
RUN npp install mongodb
RUN npp install assert
RUN npp install minimist