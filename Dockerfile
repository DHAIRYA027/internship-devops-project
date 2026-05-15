FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG APP_VERSION
ARG BUILD_NUMBER

ENV APP_VERSION=$APP_VERSION
ENV BUILD_NUMBER=$BUILD_NUMBER

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "index.js"]