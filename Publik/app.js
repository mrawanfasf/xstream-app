// Login handling
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        window.location.href = '/views/settings.html';
      } else {
        alert('Login gagal. Coba lagi.');
      }
    });
  }

  // Stream setting form handling
  const streamForm = document.getElementById('stream-form');
  if (streamForm) {
    streamForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const streamUrl = document.getElementById('stream-url').value;
      const resolution = document.getElementById('resolution').value;
      const fps = document.getElementById('fps').value;
      const bitrate = document.getElementById('bitrate').value;

      const res = await fetch('/api/save-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ streamUrl, resolution, fps, bitrate })
      });

      const data = await res.json();
      if (data.success) {
        alert('Pengaturan berhasil disimpan');
      } else {
        alert('Gagal menyimpan pengaturan');
      }
    });
  }

  // Download video from Google Drive
  const downloadForm = document.getElementById('download-form');
  if (downloadForm) {
    downloadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileId = document.getElementById('gdrive-file-id').value;

      const res = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId })
      });

      const data = await res.json();
      if (data.success) {
        alert('Video berhasil diunduh');
      } else {
        alert('Gagal mengunduh video');
      }
    });
  }
});
