# Define Node.js base image
FROM node:24.11.0

# Expose port 1233
EXPOSE 1233

# Set target image directory
WORKDIR /opt/riddonkulous-web

# Copy all files to the image directory
COPY . /opt/riddonkulous-web

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Use JSON array syntax for ENTRYPOINT and CMD for starting the app
ENTRYPOINT ["npm", "run", "start"]
