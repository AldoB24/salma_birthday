# Satu Hari Istimewa ✦

Website kejutan ulang tahun satu halaman yang dibuat dengan HTML, CSS, dan JavaScript murni. Tidak perlu instalasi paket atau layanan berbayar.

## Menjalankan secara lokal

Buka `index.html` di browser atau gunakan **Live Server** di VS Code. Python tidak diperlukan.

## Deploy ke Vercel

Proyek ini adalah website statis—tanpa Python, build, maupun konfigurasi khusus. Unggah folder proyek ke repository GitHub, lalu impor repository tersebut di Vercel dan deploy sebagai proyek statis. Pastikan `index.html`, `styles.css`, `script.js`, foto, dan `NCT127.mp3` ikut diunggah; semuanya dirujuk menggunakan path relatif.

## Personalisasi

Buka `script.js`, lalu sesuaikan objek `birthdayConfig` di bagian atas:

- `recipientName`: nama orang yang berulang tahun.
- `birthdayMessage`: ucapan ulang tahun.
- `photoCards`: caption, deskripsi aksesibilitas, dan URL foto kenangan. Galeri memakai foto lokal `1.jpg`–`4.jpg`, `5.jpg`, dan `6.JPG`, sehingga foto tidak memerlukan koneksi internet. File `5.jpg` adalah salinan kompatibel browser dari foto asli `5.HEIC`.

Teks surat rahasia, cerita timeline, dan detail visual lainnya bisa diubah langsung di `index.html`. Warna dan responsivitas diatur melalui variabel CSS di bagian atas `styles.css`.

Halaman mencoba memutar file lokal `NCT127.mp3` otomatis saat dibuka. Jika kebijakan browser memblokir autoplay, tombol musik akan muncul agar pengunjung dapat mengaktifkannya dengan satu sentuhan. Gerakan visual menghormati pengaturan _reduce motion_ pada perangkat.
