# Gunakan base image ringan dan terbaru
FROM node:22-slim

LABEL maintainer="officialdittaz" \
      version="1.0.0" \
      description="WhatsApp Bot by Dittaz - Optimized Node.js runtime"

# Install hanya dependency yang dibutuhkan
RUN apt-get update && apt-get install -y \
  imagemagick\
  ffmpeg\
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Upgrade npm ke versi 11 (jika belum terinstal otomatis)
RUN npm install -g npm@11

# Set working directory
WORKDIR /usr/src/app

# Salin hanya file untuk install dependensi (biar caching optimal)
COPY package.json package-lock.json ./

# Install dependency production saja, cepat dan ringan
RUN npm ci --omit=dev

# Salin semua sisa source code
COPY . .

# Nonaktifkan header "x-powered-by" default Express (kalau kamu pakai)
ENV NODE_ENV=production

# Ganti hak kepemilikan agar aman untuk non-root
RUN chown -R node:node .

# Buka port yang dibutuhkan
EXPOSE 8080

# Jalankan sebagai user non-root
USER node


# Jalankan app dengan batas RAM (512 MB) agar hemat
CMD ["node", "--max-old-space-size=512", "index.js"]
