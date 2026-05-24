# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci --only=production
RUN npx prisma generate

# Copia código fonte
COPY . .

# Compila TypeScript
RUN npm run build

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Copia arquivos do build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expoe a porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Inicia a aplicação
CMD ["node", "dist/server.js"]
