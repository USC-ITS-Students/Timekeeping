# install and start mongodb
FROM mongo:latest

# Add the application resources URL
RUN echo "deb http://archive.ubuntu.com/ubuntu/ $(lsb_release -sc) main universe" >> /etc/apt/sources.list

# Update the sources list
RUN apt-get update

# Install basic applications
RUN apt-get install -y tar git curl nano wget dialog net-tools build-essential

# Install Python and Basic Python Tools
RUN apt-get install -y python python-dev python-distribute python-pip

# create /import folder to dump files
MKDIR /import
COPY MongoDBImport.py /import/MongoDBImport.py
COPY data.txt /import/data.txt

# Go to /import
WORKDIR /import

# Run the script
# CMD ["python", "MongoDBImport.py"]