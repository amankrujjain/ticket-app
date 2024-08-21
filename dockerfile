FROM node

WORKDIR /app

RUN npm install

COPY . /app

EXPOSE 5000

CMD [ "node","index.js" ]