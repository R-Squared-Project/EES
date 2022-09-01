FROM node:18

WORKDIR /var/ees

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .