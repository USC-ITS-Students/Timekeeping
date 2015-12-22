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

EXPOSE  3000
CMD ["npm", "production"]