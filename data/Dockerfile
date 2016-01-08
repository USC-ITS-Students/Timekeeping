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

# Go to /import
WORKDIR /import