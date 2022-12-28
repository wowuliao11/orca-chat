# develop stage
FROM node:lts-alpine as development

WORKDIR /app

COPY package*.json ./

COPY . .

RUN yarn cache clean

RUN yarn global add @quasar/cli --network-timeout 100000

COPY .env.production .env

# build stage
FROM development as build-stage

RUN yarn cache clean

RUN yarn --network-timeout 100000

RUN quasar build

# production stage
FROM nginx:1.17.5-alpine as production-stage

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
