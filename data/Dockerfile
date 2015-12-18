# install and start mongodb
FROM mongo:latest

# install python
RUN apt-get install -y python

# create /import folder to dump files
MKDIR /import
COPY MongoDBImport.py /import/MongoDBImport.py
COPY data.txt /import/data.txt

# Go to /import
WORKDIR /import

# Run the script
# CMD ["python", "MongoDBImport.py"]