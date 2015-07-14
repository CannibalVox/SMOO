FROM node:0.12.7-slim

ENV MONGO_URI=mongodb://mongo/
ENV NODE_ENV=development
COPY /dist .
RUN npm install
EXPOSE 3000

CMD ["node", "app.js"]
