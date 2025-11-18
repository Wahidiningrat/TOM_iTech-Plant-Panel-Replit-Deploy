# 📡 Panduan Koneksi ESP32 ke Dashboard

## 🎯 Cara Kerja

Dashboard TOM_iTECH sekarang dapat terhubung **langsung** ke ESP32 Anda tanpa memerlukan server backend. Dashboard akan mengambil data sensor secara real-time melalui koneksi HTTP lokal.

## 🔧 Persiapan ESP32

### 1. Hardware yang Dibutuhkan
- ESP32 Development Board
- Sensor kelembapan tanah
- Sensor suhu (DHT11/DHT22 atau sensor analog)
- Sensor cahaya (LDR atau sensor analog)
- Sensor tegangan (voltage divider)

### 2. Upload Kode ke ESP32

Gunakan file `ESP32_EXAMPLE.ino` sebagai template. Sebelum upload, pastikan untuk:

```cpp
// Ganti dengan kredensial WiFi Anda
const char* ssid = "Nama_WiFi_Anda";
const char* password = "Password_WiFi_Anda";
```

### 3. Sambungkan Sensor ke ESP32

**Contoh pin assignment:**
- Sensor Kelembapan Tanah → GPIO 34 (ADC1_CH6)
- Sensor Suhu → GPIO 35 (ADC1_CH7)
- Sensor Cahaya → GPIO 36 (ADC1_CH0)
- Sensor Tegangan → GPIO 39 (ADC1_CH3)

> **Catatan:** Sesuaikan nomor pin dengan setup Anda

### 4. Dapatkan IP Address ESP32

Setelah ESP32 tersambung ke WiFi:
1. Buka Serial Monitor di Arduino IDE (baud rate: 115200)
2. Catat IP Address yang muncul (contoh: `192.168.1.100`)
3. IP ini akan digunakan untuk konfigurasi dashboard

## 🌐 Konfigurasi Dashboard

### Langkah 1: Buka Dashboard
1. Login ke aplikasi TOM_iTECH
2. Klik "To Panel" atau "Get Started"
3. Anda akan masuk ke halaman Dashboard

### Langkah 2: Konfigurasi IP ESP32
1. Klik tombol **"+"** di sidebar kiri
2. Masukkan IP Address ESP32 (contoh: `192.168.1.100`)
3. Klik OK

### Langkah 3: Verifikasi Koneksi
- Status koneksi akan muncul di bagian atas dashboard
- ✅ **Hijau** = Terhubung berhasil
- ❌ **Merah** = Gagal terhubung (semua sensor akan menampilkan nilai 0)
- 🔄 **Biru** = Sedang mengambil data

**Catatan:** Saat ESP32 tidak terhubung:
- Semua nilai sensor akan otomatis direset ke 0
- Tabel "Perangkat Terhubung" akan dikosongkan
- Ini memastikan tidak ada data yang tidak akurat ditampilkan

## 📊 Format Data JSON dari ESP32

ESP32 harus mengirim data dalam format JSON berikut:

```json
{
  "soilMoisture": 65.5,
  "temperature": 27.3,
  "lightIntensity": 750,
  "voltage": 12.8
}
```

**Endpoint:** `http://[IP_ESP32]/data`  
**Method:** GET  
**Content-Type:** application/json

## 🔄 Auto-Refresh

Dashboard akan **otomatis memperbarui data** setiap 5 detik. Anda tidak perlu melakukan refresh manual.

## 🛠️ Troubleshooting

### ❌ Gagal Terhubung

**Kemungkinan Penyebab:**

1. **ESP32 tidak terhubung ke WiFi**
   - Cek Serial Monitor untuk memastikan ESP32 tersambung
   - Pastikan kredensial WiFi benar

2. **IP Address salah**
   - Verifikasi IP dari Serial Monitor
   - Cek ulang IP yang dimasukkan di dashboard

3. **Perangkat tidak di jaringan yang sama**
   - ESP32 dan komputer Anda harus terhubung ke WiFi yang sama
   - Coba ping IP ESP32: `ping 192.168.1.100`

4. **CORS Error**
   - Pastikan kode ESP32 mengaktifkan CORS (sudah ada di `ESP32_EXAMPLE.ino`)
   - Header berikut harus ada di response ESP32:
     ```
     Access-Control-Allow-Origin: *
     ```

5. **Firewall memblokir**
   - Nonaktifkan sementara firewall untuk testing
   - Pastikan port 80 terbuka

### 🔍 Debug Mode

Buka **Developer Console** di browser (F12):
- Lihat error di tab Console
- Cek network requests di tab Network
- Pastikan request ke `http://[IP]/data` berhasil (status 200)

## 📱 Akses dari Smartphone

Untuk mengakses dashboard dari smartphone:

1. Pastikan smartphone terhubung ke **WiFi yang sama** dengan ESP32
2. Buka browser di smartphone
3. Akses dashboard (gunakan IP Replit atau custom domain Anda)
4. Konfigurasi IP ESP32 seperti biasa

## 🚀 Tips Optimasi

1. **Gunakan IP Statis untuk ESP32**
   - Set IP statis di router atau kode ESP32
   - Menghindari IP berubah setelah restart

2. **Tambahkan Error Handling di ESP32**
   - Validasi pembacaan sensor
   - Kirim status error jika sensor gagal

3. **Logging**
   - Monitor Serial untuk debugging
   - Catat semua request yang masuk ke ESP32

## 📝 Modifikasi Kode ESP32

Jika Anda menggunakan sensor berbeda, sesuaikan fungsi `readSensors()`:

```cpp
void readSensors() {
  // Contoh untuk DHT22
  soilMoisture = analogRead(34) / 40.95;
  
  // Ganti dengan library DHT
  temperature = dht.readTemperature();
  
  // Sensor cahaya analog
  lightIntensity = analogRead(36) / 4.095;
  
  // Voltage divider
  voltage = (analogRead(39) / 4095.0) * 3.3 * 5.0;
}
```

## 🔐 Keamanan

**Untuk Produksi:**
- Jangan ekspos ESP32 ke internet publik
- Gunakan autentikasi untuk endpoint
- Implementasi HTTPS jika memungkinkan
- Validasi data sebelum ditampilkan

---

## 💡 Contoh Response Sukses

```
✅ Terhubung ke ESP32 (192.168.1.100) - Diperbarui: 14:30:25
```

Selamat mencoba! 🌿
