#From base image node

FROM node:22.8.0

#Create app directory

#Set the /usr/src/app directory to WORKDIR

WORKDIR /workspace

# Copying all the files from your file system to container file system

#Install all dependencies
COPY package.json ./.
# Copy other files too


#Expose the port

EXPOSE 8080

#Command to run app when intantiate an image

CMD ["npm","start"]
