// src/gdrive.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');

// Pastikan folder uploads ada
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Mengunduh video dari Google Drive menggunakan `gdown`
 * @param {string} gdriveUrl - Shareable link Google Drive (public)
 * @param {string} outputFilename - Nama file hasil unduhan, contoh: "video.mp4"
 * @param {function} callback - Callback function setelah unduhan selesai
 */
function downloadFromDrive(gdriveUrl, outputFilename, callback) {
  const outputPath = path.join(uploadsDir, outputFilename);

  const command = `gdown "${gdriveUrl}" -O "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Download error: ${error.message}`);
      return callback(error);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    console.log(`stdout: ${stdout}`);
    console.log(`File berhasil diunduh ke: ${outputPath}`);
    callback(null, outputPath);
  });
}

module.exports = { downloadFromDrive };
