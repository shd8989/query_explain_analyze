FROM node:18
WORKDIR /app
COPY package.json ./
COPY backend ./
COPY frontend ./

#RUN npm run setup

COPY . ./
EXPOSE 3000
CMD ["npm", "run", "setup"]
CMD ["npm", "run", "start"]