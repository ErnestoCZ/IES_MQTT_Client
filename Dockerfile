FROM node:20.11.0 as BUILD

WORKDIR /app

COPY . . 

RUN npm install && npx tsc -p ./tsconfig.json



FROM node:20.11.0

WORKDIR /app

COPY package.json .

RUN npm install --save

COPY --from=BUILD /app/dist dist


CMD ["node" , "./dist/app.js"]