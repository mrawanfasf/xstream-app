const { db } = require('./database');

// Fungsi reset password user
function resetPassword(username, newPassword, callback) {
  const query = `UPDATE users SET password = ? WHERE username = ?`;
  db.run(query, [newPassword, username], function (err) {
    if (err) return callback(err);
    if (this.changes === 0) {
      return callback(new Error('User tidak ditemukan.'));
    }
    callback(null, 'Password berhasil direset.');
  });
}

// Contoh penggunaan dari terminal
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Cara pakai: node reset-password.js <username> <newPassword>');
  process.exit(1);
}

const [username, newPassword] = args;

resetPassword(username, newPassword, (err, message) => {
  if (err) {
    console.error('Gagal reset password:', err.message);
  } else {
    console.log(message);
  }
});
