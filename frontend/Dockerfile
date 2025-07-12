### STAGE 1: Build ###
FROM node:20.0.0-alpine3.16 AS build

# Install dependencies needed for native modules
RUN apk --no-cache add --virtual builds-deps build-base python3 git

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

### STAGE 2: Run ###
FROM nginx:stable-alpine

# Copy nginx configuration
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf

# Create SSL directory and copy certificates
RUN mkdir -p /etc/nginx/ssl
COPY ssl/server* /etc/nginx/ssl/

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 8443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]