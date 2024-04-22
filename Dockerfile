# FROM node:14
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5000
# CMD ["npm", "start"]

# FROM node:latest

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install --build-from-source

# COPY . .

# EXPOSE 5000
# CMD ["npm", "start"]

# FROM node:14

# # Create a non-root user
# RUN adduser --disabled-password --gecos "" appuser
# USER appuser

# WORKDIR /app

# # Copy package.json and package-lock.json separately to leverage Docker layer caching
# COPY package*.json ./
# RUN npm install --ignore-scripts  # Include --ignore-scripts flag to skip execution of lifecycle scripts

# # Copy application files
# COPY . .

# # Expose port
# EXPOSE 5000


FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install node-pre-gyp globally
RUN npm install -g node-pre-gyp

# Copy the rest of the application code
COPY . .

# Rebuild the bcrypt module
RUN npm rebuild bcrypt --build-from-source

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

