# Gunakan image Node.js resmi
FROM node:18

# Install gdown & Python3
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install gdown

# Atur direktori kerja
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file proyek
COPY . .

# Buat folder uploads jika belum ada
RUN mkdir -p src/uploads

# Ekspose port backend
EXPOSE 3000

# Jalankan server
CMD ["node", "src/server.js"]
