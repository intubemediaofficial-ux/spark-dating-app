FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install --production && npx prisma generate

# Copy source
COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
