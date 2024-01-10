FROM node:18

WORKDIR /app
#COPY package.json ./
COPY . ./
RUN npm install

WORKDIR /app/backend
#COPY backend /app
#COPY backend/package.json ./
RUN npm install
#COPY . ./

WORKDIR /app/frontend
#COPY frontend /app
#COPY frontend/package.json ./
RUN npm install
#COPY . ./

#RUN npm run setup
#RUN npm install
#WORKDIR /app/backend
#RUN npm install
#WORKDIR /app/frontend
#RUN npm install

WORKDIR /app
EXPOSE 3000
#CMD ["npm run start"]   