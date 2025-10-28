## Cemani — WhatsApp Bot Topup + Dashboard & Pembayaran Otomatis

Produk ini adalah sistem bot WhatsApp untuk penjualan/topup digital yang terintegrasi dengan pembayaran otomatis (QRIS Midtrans/Xendit), manajemen stok produk, serta dashboard web untuk analitik dan operasional. Fokusnya: cepat dipakai, mudah dipantau, dan siap dipamerkan dalam portofolio.

### Kasus Penggunaan: UMKM SerasaLidah (Alur Pesan → Cabang)
- **Tujuan**: Mempermudah alur pemesanan. Customer chat ke nomor pusat, bot kirimkan template isian, customer mengisi, lalu pesanan diteruskan ke cabang pengambilan sesuai pilihan customer.
- **Alur Singkat**:
  1. Customer mengirim chat ke nomor pusat.
  2. Bot mengirimkan template isian (nama, menu/varian, jumlah, jadwal, cabang pengambilan, catatan).
  3. Customer membalas dengan format yang diminta.
  4. Bot memvalidasi isian dan memastikan cabang tersedia.
  5. Bot meneruskan detail pesanan ke kanal/nomor cabang terkait untuk diproses.
  6. Opsional: Jika diperlukan pembayaran otomatis, bot menerbitkan QRIS (Midtrans/Xendit) dan mengonfirmasi setelah paid.
- **Manfaat**: Mengurangi salah format pesanan, mengarahkan pesanan ke cabang yang tepat, dan menjaga monitoring dari pusat via dashboard.

Catatan: Implementasi nomor pusat, daftar cabang, serta format template dapat disesuaikan pada konfigurasi dan handler bot yang ada (mis. teks/menu di `setting.js` dan logic di `index.js`/`main.js`).

### Fitur Utama
- **Bot WhatsApp (Multi-Device)**: Berbasis `@dappaoffc/baileys`, mendukung pairing code.
- **Menu Transaksional**: List produk, order, done/proses, testimoni, kalkulator, tracking riwayat/transaksi.
- **Topup & Saldo**: Perintah `deposit`, `saldo`, `listharga`, `upgrade` dan admin tools (add/del stok, add/min saldo, block/unblock, backup, dll).
- **Pembayaran Otomatis**:
  - Midtrans: QRIS, webhook verifikasi signature, auto-clear cache, event `payment-completed`.
  - Xendit: Pembuatan invoice QRIS via API, penyimpanan cache pembayaran lokal.
- **Dashboard Web (API + Demo UI)**:
  - API `options/dashboard-api.js` untuk overview, chart, user activity, transaksi, receipts, export.
  - Demo front-end di `demo-dashboard.html` untuk melihat metrik dan fitur utama.
- **Manajemen Stok Produk**: CRUD produk, batch add/remove stok, analytics stok, report, dan export.
- **Penyimpanan Fleksibel**: JSON file bawaan, dapat di-upgrade ke PostgreSQL dengan migrasi.
- **Otomasi Operasional**: Skrip backup/restore, deduplikasi transaksi, update cache pembayaran.

### Tech Stack
- Runtime: Node.js (Express untuk API)
- WhatsApp: `@dappaoffc/baileys`
- Pembayaran: Midtrans, Xendit
- Database: File JSON (default) atau PostgreSQL (opsional)
- Utilitas: `dotenv`, `cors`, `pino`, `chalk`, `figlet`

### Struktur Proyek (ringkas)
- `main.js` — bootstrap koneksi WA dan load `index.js`
- `index.js` — handler utama bot (commands, flow)
- `setting.js` — teks menu dan konfigurasi tampilan bot
- `options/dashboard-api.js` — server API dashboard + webhook Midtrans
- `demo-dashboard.html` — halaman demo dashboard
- `config/midtrans.js`, `config/xendit.js` — integrasi payment
- `options/database.json` — database default (file)
- `options/schema.sql`, `config/postgres.js` — mode PostgreSQL
- `webhook-midtrans.js` — server webhook standalone (opsional)

### Prasyarat
- Node.js LTS (disarankan >= 18)
- Git
- Midtrans &/atau Xendit akun sandbox/production
- (Opsional) PostgreSQL 14+

### Instalasi
```bash
git clone <repo-url>
cd cemani
npm install
```

### Konfigurasi Environment
Salin `.env` dari template:
```bash
cp env.example .env
```
Lalu isi kredensial Midtrans (wajib untuk QRIS Midtrans) dan variabel lain yang diperlukan.

Contoh variabel penting:
- `MIDTRANS_MERCHANT_ID`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION` (true/false)

Untuk Xendit, modul `config/xendit.js` membaca `.env` lokal di folder `config/` jika ada. Isi `XENDIT_SECRET_KEY` bila menggunakan Xendit.

Jika ingin memakai PostgreSQL untuk dashboard API:
- Set `USE_PG=true` di environment API
- Pastikan koneksi di `config/postgres.js`

### Menjalankan Bot WhatsApp
```bash
npm run start
```
Pertama kali, bot akan meminta nomor WhatsApp (format 62…) untuk pairing code bila diperlukan, lalu menampilkan kode pairing di terminal.

Menu bot (contoh sebagian dari `setting.js`):
- Admin: `addstok`, `delstok`, `addsaldo`, `minsaldo`, `addsewa`, `delsewa`, `block`, `unblock`, `backup`
- Store: `list`, `addlist`, `dellist`, `setlist`, `testi`, `addtesti`, `deldone`, `changedone`, `proses`, `setproses`, `changeproses`
- Topup: `deposit`, `saldo`, `listharga`, `upgrade`
- Tracking: `riwayat <nomor>`, `cari <reff_id>`, `statistik`, `export <format>`, `dashboard`

### Menjalankan Dashboard API
```bash
npm run dashboard
# Dev dengan auto-reload:
npm run dashboard:dev
```
Default port: `3002` (`PORT` dapat diubah). Demo front-end tersedia di `demo-dashboard.html` dan dapat diarahkan ke `API_BASE` yang sesuai.

Contoh endpoints penting (lihat konsol startup untuk daftar lengkap):
- GET `/api/dashboard/overview`
- GET `/api/dashboard/chart/daily`
- GET `/api/dashboard/chart/monthly`
- GET `/api/dashboard/users/all?page=1&limit=10&search=&role=all`
- GET `/api/dashboard/transactions/recent?limit=20`
- GET `/api/dashboard/export/:format`
- Stock: GET/PUT `/api/dashboard/products/:productId/stock`, dsb.
- Receipts: GET `/api/dashboard/receipts/:reffId`

### Webhook Midtrans
Endpoint webhook sudah disediakan di `options/dashboard-api.js`:
- POST `/webhook/midtrans`
- Verifikasi signature menggunakan SHA512 (`order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY`).
- Pada settlement/capture, event `payment-completed` di-emit untuk memproses order.

Mode standalone juga tersedia di `webhook-midtrans.js` (port default 3001).

### Integrasi Pembayaran
- **Midtrans (`config/midtrans.js`)**
  - Membuat QRIS via `/v2/charge`
  - Cek status via `/v2/{orderId}/status`
- **Xendit (`config/xendit.js`)**
  - Membuat Invoice dengan metode `QRIS`
  - Menyimpan cache pembayaran sementara untuk efisiensi

### Mode PostgreSQL (Opsional)
Aktifkan dengan `USE_PG=true` pada API. Gunakan skrip:
```bash
npm run pg:schema   # apply schema
npm run pg:migrate  # migrasi data dari JSON
npm run pg:dedup    # deduplikasi transaksi
```

### Skrip Penting
- `start` — menjalankan bot WhatsApp (`node nicola` -> bootstrap ke `main.js`/`index.js`)
- `dashboard` — menjalankan API dashboard
- `start-safe` — otomatis backup sebelum start
- `backup`/`restore`/`backup-list`/`backup-health` — utilitas backup

### Deployment Singkat
- Pastikan domain/API reverse proxy (lihat `nginx-dashboard.conf` sebagai contoh)
- Set `.env` untuk production
- Jalankan API dan webhook sebagai service (PM2/systemd)
- Point demo front-end atau UI Anda ke `API_BASE` production

### Keamanan & Praktik Baik
- Jangan commit kunci produksi. Gunakan `.env` untuk rahasia.
- Validasi tanda tangan webhook selalu aktif.
- Batasi CORS origin pada API ke domain yang dipercaya.

### Showcase Portofolio
Highlight yang bisa Anda tampilkan:
- Integrasi penuh WhatsApp Commerce: katalog, stok, order, pembayaran otomatis.
- Dashboard analitik real-time, prediksi, dan laporan stok.
- Arsitektur fleksibel: file-based → PostgreSQL tanpa ubah besar pada API.
- Otomasi operasional: backup, migrasi, dedup, cache pembayaran.

Tambahkan screenshot:
- QRIS checkout (Midtrans/Xendit)
- Halaman Demo Dashboard (`demo-dashboard.html`)
- Contoh receipt di `options/receipts/`

### Lisensi & Kredit
- Lisensi: ISC (lihat `package.json`)
- Author: Ronzz YT — kustomisasi oleh Anda untuk kebutuhan produksi/portofolio.

## Migrasi options/database.json ke Postgres

1) Siapkan Postgres (contoh lokal)

```bash
createdb bot_wa
createuser -P botwa  # isi password sesuai PG_PASSWORD
psql -d bot_wa -c "GRANT ALL PRIVILEGES ON DATABASE bot_wa TO botwa;"
```

2) Konfigurasi environment

Edit `config/env.example` menjadi `.env` dan set:

```ini
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=bot_wa
PG_USER=botwa
PG_PASSWORD=changeme
USE_PG=true
```

3) Apply schema

```bash
npm run pg:schema
```

4) Jalankan migrasi dari `options/database.json`

```bash
npm run pg:migrate
```

5) Verifikasi jumlah data (opsional)

```sql
-- via psql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM transaksi;
SELECT COUNT(*) FROM produk;
```

Catatan: Aplikasi saat ini masih membaca `options/database.json`. Setelah migrasi, langkah berikutnya adalah mengganti akses baca/tulis ke Postgres menggunakan modul `config/postgres.js` atau adapter kompatibel `Database` jika diperlukan.


