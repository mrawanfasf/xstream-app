const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/views', express.static(path.join(__dirname, '..', 'views')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'setup.html'));
});

app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'history.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'gallery.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'settings.html'));
});

// Download dari Google Drive menggunakan gdown
app.post('/download', (req, res) => {
  const { gdriveUrl } = req.body;

  if (!gdriveUrl) {
    return res.status(400).json({ error: 'Google Drive URL is required' });
  }

  // Ekstrak ID dari URL Google Drive
  const match = gdriveUrl.match(/[-\w]{25,}/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid Google Drive URL' });
  }

  const fileId = match[0];
  const uploadsDir = path.join(__dirname, 'uploads');
  const outputPath = path.join(uploadsDir, `${fileId}.mp4`);

  // Buat folder uploads jika belum ada
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Perintah gdown
  const command = `gdown https://drive.google.com/uc?id=${fileId} -O "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Download error: ${stderr}`);
      return res.status(500).json({ error: 'Download failed' });
    }

    console.log(`Downloaded: ${stdout}`);
    res.json({ message: 'Download successful', path: outputPath });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
