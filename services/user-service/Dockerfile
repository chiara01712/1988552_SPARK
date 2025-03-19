FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install pg --save
COPY . .
EXPOSE 8080
CMD ["npm", "start"]