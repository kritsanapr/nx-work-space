FROM node:16.15.1-alpine3.15 As development

WORKDIR /usr/src

COPY package*.json nx.json ./

RUN apk add --no-cache python3 make g++

RUN apk update \
  && apk add --no-cache git openssh bash \
  && yarn global add @angular/cli @compodoc/compodoc ts-node typescript jest nx rxjs

COPY . .


EXPOSE  8080 4200 3333 3000
