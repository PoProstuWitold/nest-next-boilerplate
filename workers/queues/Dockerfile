#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /poprostuwitold/workers/queues

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /poprostuwitold/workers/queues

COPY --from=development /poprostuwitold/workers/queues .

CMD [ "node", "dist/main" ]