FROM    centos:centos7

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN     yum install -y epel-release
# Install Node.js and npm
RUN     yum install -y nodejs npm

# Install app dependencies
COPY src/ /src
COPY package.json /src/package.json
WORKDIR /src
RUN npm install -production

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/* && \
  python -m pip install pymongo

# create /import folder to dump files
RUN mkdir /import
COPY MongoDBImport.py /import/MongoDBImport.py
COPY data/data.txt /import/data.txt
RUN python /import/MongoDBImport.py -d Timesheet -c users -f data.txt

EXPOSE  3000
CMD ["node", "bin/www"]