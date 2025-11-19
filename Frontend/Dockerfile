FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY postcss.config.cjs tailwind.config.cjs ./

COPY ./src ./src
COPY ./public ./public

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
