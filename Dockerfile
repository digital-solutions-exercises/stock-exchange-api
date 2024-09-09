# Use Node.js 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon in Docker container
RUN npm install -g nodemon

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run compile

# Expose the port on which the NestJS application will run
EXPOSE 4002

# Command to run the NestJS application
CMD ["npm", "run", "start"]
