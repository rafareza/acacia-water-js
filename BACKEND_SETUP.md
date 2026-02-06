# Backend Setup Guide

## Overview
Backend API menggunakan PHP dengan SQLite sebagai database. Sistem ini menyimpan data produk dan order yang ditambahkan/diedit oleh admin sehingga tetap sinkron dengan user side.

## Prerequisites
- PHP 7.4 atau lebih tinggi
- SQLite3 (biasanya sudah terinclude di PHP)

## Setup Instructions

### 1. Start Backend Server

Buka terminal di folder `backend` dan jalankan:

```bash
cd backend
php -S localhost:8000
```

Server akan berjalan di: `http://localhost:8000`

### 2. Verify Backend Running

Cek dengan membuka di browser atau terminal:
```bash
curl http://localhost:8000/api
```

Jika berhasil akan return:
```json
{"status":"ok"}
```

### 3. Frontend Configuration

Frontend sudah dikonfigurasi untuk connect ke `http://localhost:8000/api`

## API Endpoints

### Products (Produk)

#### GET /api/products
Dapatkan semua produk
```bash
curl http://localhost:8000/api/products
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Galon Air 19L",
      "price": 21000,
      "imageUrl": "https://...",
      "category": "Air",
      "stock": true,
      "description": "...",
      "createdAt": "2025-01-27T10:00:00+00:00"
    }
  ]
}
```

#### POST /api/products
Tambah produk baru
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produk Baru",
    "price": 50000,
    "imageUrl": "https://...",
    "category": "Air",
    "stock": true,
    "description": "Deskripsi produk"
  }'
```

#### PUT /api/products/{id}
Update produk
```bash
curl -X PUT http://localhost:8000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Baru",
    "price": 25000,
    "stock": false
  }'
```

#### DELETE /api/products/{id}
Hapus produk
```bash
curl -X DELETE http://localhost:8000/api/products/1
```

### Orders (Pesanan)

#### GET /api/orders
Dapatkan semua order

#### POST /api/orders
Buat order baru (otomatis disimpan saat user checkout)

#### PUT /api/orders/{id}
Update status order (dari admin dashboard)

#### DELETE /api/orders/{id}
Hapus order

## Database

Database file tersimpan di:
```
backend/data/app.sqlite
```

### Database Schema

#### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  imageUrl TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 1,  -- 1 = tersedia, 0 = tidak
  description TEXT,
  createdAt TEXT,
  updatedAt TEXT
)
```

#### Orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customerName TEXT NOT NULL,
  customerEmail TEXT NOT NULL,
  items TEXT NOT NULL,  -- JSON string
  paymentMethod TEXT,
  address TEXT,
  notes TEXT,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT "Pending",
  createdAt TEXT,
  updatedAt TEXT
)
```

## Realtime Sync

### Mekanisme Sync

1. **Admin Menambah/Edit/Hapus Produk**
   - Data dikirim ke backend API
   - Backend menyimpan ke SQLite
   - ProductContext update state
   - localStorage di-update

2. **User Side Otomatis Update**
   - **Auto-Polling**: Setiap 3 detik fetch produk terbaru
   - **Storage Event**: Detect perubahan localStorage dari tab lain
   - **Visibility Change**: Refresh saat tab kembali active
   - **Auto-Poll Interval**: Fallback mechanism

### Diagram Alur

```
Admin Update Produk
       ↓
POST/PUT/DELETE /api/products
       ↓
Backend SQLite Save
       ↓
ProductContext Update
       ↓
localStorage Update
       ↓
Storage Event Triggered (cross-tab)
       ↓
User Side Products Component Re-render
       ↓
User Lihat Produk yang Sudah Updated ✓
```

## Troubleshooting

### Backend tidak terkoneksi
- Pastikan PHP server sudah berjalan di port 8000
- Cek di browser: `http://localhost:8000/api`
- Cek console browser untuk error messages

### Data tidak update di user side
- Buka console browser (F12)
- Lihat di Network tab apakah request ke `/api/products` berhasil
- Verify di localStorage: buka DevTools → Application → LocalStorage

### Produk tidak tersimpan
1. Cek apakah backend running
2. Cek response dari API endpoint
3. Cek file `backend/data/app.sqlite` ada atau tidak

### Jika database rusak
```bash
# Hapus database lama
rm backend/data/app.sqlite

# Server akan otomatis membuat database baru saat startup
php -S localhost:8000
```

## Production Notes

Untuk production deployment:

1. Ganti localhost:8000 dengan domain production di ProductContext
2. Setup SSL/HTTPS
3. Konfigurasi CORS sesuai domain production
4. Backup database SQLite secara berkala
5. Gunakan web server production (Apache/Nginx) bukan built-in PHP server

## Architecture

```
frontend/
├── ProductManagement.jsx     (Admin add/update/delete)
├── Products.jsx              (User lihat produk)
└── ProductContext.jsx        (Manage state + API calls)
        ↓
http://localhost:8000/api/products
        ↓
backend/
├── api.php                   (API endpoints)
└── data/
    └── app.sqlite            (SQLite database)
```

## Testing

### Test Add Product
1. Buka Admin Dashboard
2. Klik "Tambah Produk"
3. Isi form dan klik "Tambah Produk"
4. Buka Products di user side
5. Produk seharusnya muncul dalam 3 detik

### Test Update Product
1. Di admin, klik edit produk
2. Ubah data dan klik "Perbarui Produk"
3. Di user side, lihat produk otomatis berubah

### Test Delete Product
1. Di admin, klik hapus produk
2. Di user side, produk seharusnya hilang dalam 3 detik

## Notes

- Produk yang ditambahkan admin langsung tersimpan ke backend database
- User side otomatis sync dengan backend setiap 3 detik
- localStorage digunakan sebagai fallback jika backend tidak tersedia
- Semua data persistent di SQLite database
