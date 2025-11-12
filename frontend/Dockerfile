FROM node:22 AS base

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build


CMD ["npm", "run", "start"]
