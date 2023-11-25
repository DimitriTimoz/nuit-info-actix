FROM node:latest
RUN npm install -g npm@latest
RUN npm config set strict-ssl false # Because of my internet connection TODO: remove this line
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
