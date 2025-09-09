FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
