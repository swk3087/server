#From base image node

FROM node:22.8.0

#Create app directory

RUN mkdir -p /usr/src/app

#Set the /usr/src/app directory to WORKDIR

WORKDIR /usr/src/app

# Copying all the files from your file system to container file system

COPY package.json ./.

#Install all dependencies

RUN npm install

# Copy other files too


#Expose the port

EXPOSE 8080

#Command to run app when intantiate an image

CMD ["npm","start"]
