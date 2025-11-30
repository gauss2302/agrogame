FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache netcat-openbsd

# Copy package files and install ALL deps (need drizzle-kit for migrations)
COPY package*.json ./
RUN npm ci

# Copy build output
COPY --from=builder /app/.output ./.output

# Copy files needed for migrations
COPY drizzle.config.ts ./
COPY src/db ./src/db
COPY src/models ./src/models
COPY tsconfig.json ./

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 4000
CMD ["./start.sh"]