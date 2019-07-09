FROM node:11-alpine

WORKDIR /usr/src/app

COPY yarn.lock ./
COPY package.json ./

RUN yarn

COPY . .

EXPOSE 8080
CMD [ "yarn", "start" ]