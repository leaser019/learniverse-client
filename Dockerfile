# Base Image
FROM node:18-alpine AS base

WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    && npm install --force --legacy-peer-deps

# Build Image
FROM node:18-alpine AS build

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl bash \
    && npm run build \
    && rm -rf node_modules \
    && npm install --only=production --force --legacy-peer-deps \
    && npx node-prune \
    && apk del git curl bash
# Production Image
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
