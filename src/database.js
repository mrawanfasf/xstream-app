const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'xstream.db');
const db = new sqlite3.Database(dbPath);

// Inisialisasi tabel jika belum ada
db.serialize(() => {
  // Tabel pengguna
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Tabel pengaturan streaming
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stream_url TEXT,
      resolution TEXT,
      fps INTEGER,
      bitrate TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabel riwayat
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      stream_url TEXT,
      started_at DATETIME,
      ended_at DATETIME
    )
  `);
});

// Fungsi: simpan pengaturan stream
function saveStreamSettings({ streamUrl, resolution, fps, bitrate }, callback) {
  const query = `
    INSERT INTO settings (stream_url, resolution, fps, bitrate)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [streamUrl, resolution, fps, bitrate], callback);
}

// Fungsi: ambil pengaturan terbaru
function getLatestSettings(callback) {
  db.get(`SELECT * FROM settings ORDER BY id DESC LIMIT 1`, callback);
}

// Fungsi: cek login user
function validateUser(username, password, callback) {
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], callback);
}

// Fungsi: tambahkan pengguna baru (hanya untuk setup awal)
function createUser(username, password, callback) {
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], callback);
}

// Fungsi: simpan riwayat streaming
function saveHistory({ filename, stream_url, started_at, ended_at }, callback) {
  db.run(`
    INSERT INTO history (filename, stream_url, started_at, ended_at)
    VALUES (?, ?, ?, ?)
  `, [filename, stream_url, started_at, ended_at], callback);
}

module.exports = {
  saveStreamSettings,
  getLatestSettings,
  validateUser,
  createUser,
  saveHistory,
  db
};
