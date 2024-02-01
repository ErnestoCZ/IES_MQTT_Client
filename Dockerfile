FROM node:20.11.0

WORKDIR /app


COPY dist/ .
COPY package.json .

RUN npm install --save

CMD ["node", "app.js"]