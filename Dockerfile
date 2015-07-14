FROM node:0.12.7:slim

COPY . /dist
RUN cd /dist; npm install
EXPOSE 8080

CMD ["node" "/dist/app.js"]
