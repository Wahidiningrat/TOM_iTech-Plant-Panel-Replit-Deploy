# 🌿 TOM_iTECH Plant Panel

> Smart Monitoring System for Your Plants — powered by TOM_iTECH Project.

[![Run on Replit](https://replit.com/badge/github/Wahidiningrat/TOM_iTech-Plant-Panel)]([https://replit.com/new/github/Wahidiningrat/TOM_iTech-Plant-Panel](https://replit.com/@farisamrullah43/TOMiTech-Plant-Panel))

---

## 🧠 Overview
**TOM_iTECH Plant Panel** adalah proyek sistem pemantauan tanaman berbasis teknologi Internet of Things (IoT).
Proyek ini dirancang untuk membaca, menampilkan, dan menganalisis kondisi tanaman secara real-time seperti:
- 🌡️ Suhu lingkungan
- 💧 Kelembapan udara
- 🌱 Kelembapan tanah
- ☀️ Intensitas cahaya

Data dari sensor dikirim ke panel utama (Plant Panel) yang menampilkan status tanaman secara dinamis dan menarik.

---

## ⚙️ Teknologi yang Digunakan
| Komponen | Deskripsi |
|-----------|------------|
| 🧩 **ESP32 / Arduino** | Mikrokontroler utama untuk membaca data sensor |
| 🌐 **Wi-Fi / MQTT / HTTP** | Protokol komunikasi ke panel |
| 💻 **Frontend (HTML/CSS/JS)** | Tampilan dashboard monitoring |
| 🧠 **Backend (Node.js / Express)** | Penghubung data sensor ke server |
| 📊 **Database (optional)** | Penyimpanan historis data tanaman |

---

## 🎯 Tujuan Proyek
Menjadi panel pemantau tanaman sederhana namun powerful — cocok untuk:
- Proyek belajar IoT 🌱
- Eksperimen AI dan otomasi pertanian 🤖
- Sistem greenhouse pintar 🏡

---

## 🚀 Cara Menjalankan (Deploy) via Replit

Cara termudah untuk memulai adalah dengan mengklik tombol **Run on Replit** di atas. Replit akan secara otomatis mengkloning repositori dan menyiapkan lingkungan kerja Anda.

### 1. Setelah Mengklik Tombol

1.  Replit akan mengkloning (`clone`) proyek.
2.  Pastikan dependensi sudah terinstal. Jika tidak, buka **Shell** dan jalankan `npm install`.

### 2. Menjalankan Proyek

* Klik tombol **Run ▶️** di bagian atas Replit.
* Dashboard akan muncul di panel **Webview**, siap menerima data sensor dari mikrokontroler (ESP32 / Arduino) melalui URL publik Replit.
