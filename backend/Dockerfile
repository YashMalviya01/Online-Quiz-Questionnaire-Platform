FROM node:18-alpine

WORKDIR /app

# Install Docker CLI for Docker Model Runner access
RUN apk add --no-cache docker-cli

COPY package.json package-lock.json* ./
RUN npm install --production && npm cache clean --force

COPY src ./src

EXPOSE 4000

CMD ["node", "src/server.js"]
