FROM node:10.18.1-alpine

WORKDIR /usr/app
COPY package.json .
RUN yarn
COPY . .
