FROM node:18-alpine

# Install yarn if not included in base image
RUN apk add --no-cache yarn

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy project files
COPY . .

# Build the app
RUN yarn build

# Expose the port Nuxt will run on
EXPOSE 3000

# Set host and port
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the application
CMD [ "node", ".output/server/index.mjs" ]