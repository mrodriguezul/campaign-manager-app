FROM node:22-alpine

WORKDIR /app

RUN npm install --global pnpm@9.15.5

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose the port
EXPOSE 3000