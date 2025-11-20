# 🌿 TOM_iTECH Plant Panel

> Smart Monitoring System for Your Plants — powered by TOM_iTECH Project.

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

Anda dapat menggunakan Replit untuk menghosting bagian **Backend** ($Node.js$ / $Express$) dan **Frontend** ($HTML/CSS/JS$) dari proyek secara cepat.

### 1. Membuat Repl Baru dari GitHub

1.  Buka Replit dan buat **New Repl**.
2.  Pilih opsi **Import from GitHub**.
3.  Masukkan URL repositori proyek: `https://github.com/Wahidiningrat/TOM_iTech-Plant-Panel.git`
4.  Replit akan secara otomatis mendeteksi bahasa proyek dan membuat lingkungan yang sesuai.

### 2. Konfigurasi dan Instalasi

* **Instal Dependensi:** Buka **Shell** di Replit dan jalankan:
    ```bash
    npm install
    ```
* **Jalankan Server:** Pastikan Replit menjalankan skrip start yang ada di `package.json`.

### 3. Menjalankan Proyek

* Klik tombol **Run ▶️** di bagian atas Replit.
* Dashboard akan muncul di panel **Webview**, siap menerima data sensor dari mikrokontroler (ESP32 / Arduino) melalui URL publik Replit.
