FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies for migrations
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm ci --omit=dev && npm install drizzle-kit tsx

# Copy build output
COPY --from=builder /app/.output ./.output

# Copy config files needed for migrations
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/src/models ./src/models
COPY --from=builder /app/tsconfig.json ./

# Copy and setup startup script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 4000
CMD ["./start.sh"]