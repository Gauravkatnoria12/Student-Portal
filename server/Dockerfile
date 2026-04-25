FROM node:20-alpine

# better-sqlite3 needs Python + build tools to compile native bindings
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./

# Install all production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Fly.io injects PORT automatically (default 8080)
EXPOSE 8080

CMD ["node", "index.js"]
