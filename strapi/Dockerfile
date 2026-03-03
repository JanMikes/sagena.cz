FROM node:22-alpine AS dev

RUN mkdir /app && chown 1000:1000 -R /app

WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run", "develop"]

EXPOSE 1337


FROM node:22-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production

COPY ./package.json ./package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
