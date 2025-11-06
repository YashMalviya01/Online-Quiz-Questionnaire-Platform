FROM node:18-alpine

WORKDIR /app

# Install Docker CLI to run docker model commands
RUN apk add --no-cache docker-cli

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy proxy server code
COPY docker-model-proxy.js ./

EXPOSE 11435

CMD ["node", "docker-model-proxy.js"]
