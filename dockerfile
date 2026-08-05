# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 5001

CMD ["npm", "start"]