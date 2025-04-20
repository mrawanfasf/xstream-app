const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// Inisialisasi express
const app = express();

// Menggunakan bodyParser untuk menerima data dari form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Direktori tempat file diunduh
const uploadsFolder = path.join(__dirname, 'src', 'uploads');

// Membuat folder uploads jika belum ada
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

// Fungsi untuk mengunduh file dari Google Drive menggunakan gdown
function downloadFileFromGoogleDrive(fileId, destinationFolder) {
  const destinationPath = path.join(destinationFolder, `${fileId}.mp4`);

  // Menjalankan perintah gdown untuk mengunduh file
  exec(`gdown https://drive.google.com/uc?id=${fileId} -O ${destinationPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing gdown: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`File downloaded: ${destinationPath}`);
  });
}

// Halaman utama untuk pengaturan dan unduhan
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Halaman untuk mengonfigurasi stream settings
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'settings.html'));
});

// Endpoint untuk memulai pengunduhan video dari Google Drive
app.post('/download', (req, res) => {
  const fileId = req.body.fileId; // Ambil fileId dari form
  const destinationFolder = uploadsFolder; // Folder tempat menyimpan file yang diunduh

  if (!fileId) {
    return res.status(400).send('File ID tidak ditemukan.');
  }

  // Panggil fungsi untuk mengunduh file dari Google Drive
  downloadFileFromGoogleDrive(fileId, destinationFolder);

  res.send(`<h1>Unduhan dimulai untuk File ID: ${fileId}</h1>`);
});

// Endpoint untuk menampilkan galeri video yang diunduh
app.get('/gallery', (req, res) => {
  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      return res.status(500).send('Terjadi kesalahan saat membaca folder uploads.');
    }
    
    let videoFiles = files.filter(file => file.endsWith('.mp4'));
    
    let videoListHtml = '<h1>Galeri Video</h1><ul>';
    videoFiles.forEach(file => {
      videoListHtml += `<li><a href="/uploads/${file}" target="_blank">${file}</a></li>`;
    });
    videoListHtml += '</ul>';
    
    res.send(videoListHtml);
  });
});

// Halaman untuk menampilkan riwayat pengunduhan
app.get('/history', (req, res) => {
  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      return res.status(500).send('Terjadi kesalahan saat membaca folder uploads.');
    }

    let videoFiles = files.filter(file => file.endsWith('.mp4'));
    let historyHtml = '<h1>Riwayat Pengunduhan</h1><ul>';

    videoFiles.forEach(file => {
      historyHtml += `<li>${file}</li>`;
    });

    historyHtml += '</ul>';
    res.send(historyHtml);
  });
});

// Menyajikan file statis (seperti gambar, video)
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
