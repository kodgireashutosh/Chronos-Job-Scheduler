FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run prisma

CMD ["npm", "run", "api"]
