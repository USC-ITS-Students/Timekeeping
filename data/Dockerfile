# install and start mongodb
FROM mongo:latest

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/*

# create /import folder to dump files
MKDIR /import
COPY MongoDBImport.py /import/MongoDBImport.py
COPY data.txt /import/data.txt

# Go to /import
WORKDIR /import

# Run the script
# CMD ["python", "MongoDBImport.py"]