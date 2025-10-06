FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production && npm cache clean --force

COPY src ./src

EXPOSE 4000

CMD ["node", "src/server.js"]
