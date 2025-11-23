FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build || echo "Nenhum build necessário"

FROM node:20

WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000

CMD ["npm", "run", "start"]
