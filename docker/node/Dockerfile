FROM node:18

WORKDIR /var/ees

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN ["chmod", "+x", "docker/node/entrypoint.sh"]
ENTRYPOINT ["docker/node/entrypoint.sh"]
