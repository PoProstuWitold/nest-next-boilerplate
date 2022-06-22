FROM node:alpine

WORKDIR /poprostuwitold/client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]