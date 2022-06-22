#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /poprostuwitold/server

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /poprostuwitold/server

COPY --from=development /poprostuwitold/server .

EXPOSE 4000

CMD [ "node", "dist/main" ]