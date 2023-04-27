# FROM node:16.15.1-alpine3.15 As development
FROM node:16.17.0 As development

WORKDIR /usr/src

COPY package*.json nx.json ./

RUN yarn global add -g @nestjs/cli @compodoc/compodoc \
    ts-node typescript jest rxjs prisma concurrently \
    yarn

COPY . .


EXPOSE  8080 4200 3333 3000 9000 9001
