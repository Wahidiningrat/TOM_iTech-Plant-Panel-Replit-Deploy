# 🛠️ Panduan Pengaturan TOM_iTECH

## 📋 Daftar Isi
- [Cara Mengakses Settings](#cara-mengakses-settings)
- [Sensor Settings](#sensor-settings)
- [Actuator Settings](#actuator-settings)
- [Network Settings](#network-settings)
- [Notification Alerts](#notification-alerts)
- [Cara Kerja Alert System](#cara-kerja-alert-system)

---

## Cara Mengakses Settings

1. Buka dashboard aplikasi (`dashbord.html`)
2. Klik ikon **⚙️ (Settings)** di sidebar kiri
3. Atau akses langsung: `setting.html`

---

## Sensor Settings

### 🌡️ Temperature Sensor (Sensor Suhu)

**Pengaturan:**
- **Min Temperature Alert**: Batas minimum suhu untuk memicu alert (default: 15°C)
- **Max Temperature Alert**: Batas maximum suhu untuk memicu alert (default: 35°C)
- **Sampling Interval**: Interval pembacaan sensor dalam detik (default: 60s)
- **Enable Alerts**: Aktifkan/nonaktifkan alert untuk sensor ini

**Contoh Penggunaan:**
- Set Min: 15°C, Max: 35°C
- Jika suhu ESP32 < 15°C atau > 35°C → Alert muncul
- Alert berbunyi (jika diaktifkan) dan muncul di pojok kanan atas

### 💧 Humidity Sensor (Sensor Kelembapan Udara)

**Pengaturan:**
- **Min Humidity Alert**: Batas minimum kelembapan (default: 30%)
- **Max Humidity Alert**: Batas maximum kelembapan (default: 80%)
- **Sampling Interval**: Interval pembacaan (default: 80s)
- **Enable Alerts**: Toggle alert

**Catatan:** Saat ini alert humidity belum terintegrasi penuh, akan ditambahkan di update mendatang.

### 🌱 Soil Moisture Sensor (Sensor Kelembapan Tanah)

**Pengaturan:**
- **Min Moisture Alert**: Batas minimum kelembapan tanah (default: 20%)
- **Max Moisture Alert**: Batas maximum kelembapan tanah (default: 80%)
- **Sampling Interval**: Interval pembacaan (default: 120s)
- **Enable Alerts**: Aktifkan/nonaktifkan alert

**Contoh Penggunaan:**
- Set Min: 20%, Max: 80%
- Jika kelembapan tanah < 20% → Alert "Soil too dry" muncul
- Jika kelembapan tanah > 80% → Alert "Soil too wet" muncul

---

## Actuator Settings

### 💦 Irrigation Pump (Pompa Irigasi)

**Pengaturan:**
- **Pump Duration**: Durasi pompa menyala (1-60 menit)
- **Auto Irrigation Moisture Level**: Level kelembapan yang memicu irigasi otomatis (%)
- **Pump Start Time**: Waktu mulai pompa (format: HH:mm, contoh: 06:00)
- **Enable Auto Mode**: Aktifkan mode otomatis

**Fitur:**
- Mode manual: Pompa menyala sesuai jadwal
- Mode otomatis: Pompa menyala saat kelembapan tanah < threshold

### 🌀 Ventilation Fan (Kipas Ventilasi)

**Pengaturan:**
- **Fan Speed**: Kecepatan kipas (0-100%)
- **Auto Fan Temp Trigger**: Suhu yang memicu kipas otomatis (°C)
- **Operating Hours**: Jam operasi kipas (format: HH:mm-HH:mm)
- **Enable Auto Mode**: Aktifkan mode otomatis

**Fitur:**
- Mode manual: Kipas beroperasi sesuai jadwal dan kecepatan tetap
- Mode otomatis: Kipas menyala saat suhu > threshold

---

## Network Settings

### 🌐 Pengaturan Jaringan

**Pengaturan:**
- **ESP32 IP Address**: Alamat IP ESP32 Anda (contoh: 192.168.1.100)
- **WiFi SSID**: Nama jaringan WiFi
- **WiFi Password**: Password WiFi (untuk referensi, tidak dikirim ke ESP32)
- **Auto-Refresh Interval**: Interval refresh data dari ESP32 (1-60 detik)

**Cara Kerja:**
1. Masukkan IP ESP32
2. Klik "Save Settings"
3. Dashboard akan otomatis menggunakan IP ini untuk koneksi
4. Refresh interval diterapkan langsung ke auto-refresh timer

**Catatan:** Saat ini WiFi SSID dan Password hanya untuk dokumentasi/referensi. Konfigurasi WiFi ESP32 dilakukan di kode Arduino.

---

## Notification Alerts

### 🔔 Pengaturan Notifikasi

**Pengaturan:**
- **Email Alerts**: Aktifkan alert via email (fitur mendatang)
- **SMS Alerts**: Aktifkan alert via SMS (fitur mendatang)
- **Push Notifications**: Aktifkan push notification (fitur mendatang)
- **Alert Sound**: Aktifkan/nonaktifkan suara alert
- **Alert Cooldown**: Waktu tunggu minimal antara alert (1-60 menit)

**Fitur Aktif:**
- ✅ **Alert Sound**: Suara "beep" saat alert muncul
- ✅ **Visual Alert**: Kotak alert muncul di pojok kanan atas
- ✅ **Alert Cooldown**: Mencegah spam alert (default: 60 detik)

**Fitur dalam Development:**
- ⏳ Email Alerts
- ⏳ SMS Alerts
- ⏳ Push Notifications

---

## Cara Kerja Alert System

### 📊 Flow Alert

```
1. ESP32 mengirim data sensor
       ↓
2. Dashboard membaca settings dari localStorage
       ↓
3. Membandingkan nilai sensor dengan threshold
       ↓
4. Jika MELEBIHI threshold:
   - Cek: Apakah alerts diaktifkan?
   - Cek: Apakah cooldown sudah habis?
       ↓
5. Jika YA → Tampilkan Alert:
   - Visual: Kotak alert di pojok kanan atas
   - Audio: Suara "beep" (jika diaktifkan)
   - Auto-dismiss setelah 5 detik
       ↓
6. Catat waktu alert terakhir (untuk cooldown)
```

### ⏱️ Alert Cooldown

- **Tujuan**: Mencegah alert muncul terus-menerus
- **Durasi**: 60 detik (hardcoded, akan bisa dikonfigurasi)
- **Cara Kerja**: Setelah alert muncul, alert yang sama tidak akan muncul lagi selama 60 detik

### 🔊 Alert Sound

Alert menggunakan Web Audio API untuk menghasilkan suara "beep":
- **Frekuensi**: 800 Hz
- **Durasi**: 0.5 detik
- **Volume**: 30% (agar tidak terlalu keras)

### 📋 Contoh Skenario

**Skenario 1: Tanah Terlalu Kering**
```
Setting:
- Min Moisture: 20%
- Max Moisture: 80%
- Enable Alerts: ON

ESP32 Data:
- Soil Moisture: 15%

Result:
⚠️ ALERT: Soil too dry (15% < 20%)
```

**Skenario 2: Suhu Terlalu Tinggi**
```
Setting:
- Min Temp: 15°C
- Max Temp: 35°C
- Enable Alerts: ON

ESP32 Data:
- Temperature: 38°C

Result:
⚠️ ALERT: Temperature too high (38°C > 35°C)
```

---

## 💾 Penyimpanan Settings

### Lokasi Penyimpanan
- Semua settings disimpan di **localStorage** browser
- Key: `tom_itech_settings`
- Format: JSON

### Struktur Data
```json
{
  "temperatureSensor": {
    "minTempAlert": "15",
    "maxTempAlert": "35",
    "samplingInterval": "60",
    "enableAlerts": true
  },
  "soilMoistureSensor": {
    "minMoistureAlert": "20",
    "maxMoistureAlert": "80",
    "samplingInterval": "120",
    "enableAlerts": true
  },
  "networkSettings": {
    "esp32IP": "192.168.1.100",
    "refreshInterval": "5"
  }
  // ... dan lainnya
}
```

### Persistensi Data
- ✅ Settings bertahan setelah refresh halaman
- ✅ Settings bertahan setelah browser ditutup dan dibuka lagi
- ❌ Settings HILANG jika:
  - Clear browser data / cookies
  - Menggunakan mode Incognito/Private
  - Mengakses dari browser/device berbeda

---

## 🔧 Tips & Tricks

### 1. Backup Settings
```javascript
// Di browser console, jalankan:
console.log(localStorage.getItem('tom_itech_settings'));

// Copy output dan simpan di file .txt
```

### 2. Restore Settings
```javascript
// Di browser console, paste settings Anda:
localStorage.setItem('tom_itech_settings', '{"temperatureSensor":{...}}');
```

### 3. Reset Settings
```javascript
// Hapus semua settings:
localStorage.removeItem('tom_itech_settings');
// Refresh halaman
```

### 4. Testing Alert System
1. Set threshold rendah (contoh: Max Temp = 20°C)
2. Tunggu ESP32 mengirim data > 20°C
3. Alert akan muncul

---

## ❓ Troubleshooting

### Settings Tidak Tersimpan
- **Cek**: Apakah browser mengizinkan localStorage?
- **Cek**: Apakah mode Incognito/Private?
- **Solusi**: Gunakan browser normal (non-private mode)

### Alert Tidak Muncul
- **Cek**: Apakah "Enable Alerts" dicentang?
- **Cek**: Apakah nilai benar-benar melebihi threshold?
- **Cek**: Apakah cooldown masih aktif? (tunggu 60 detik)
- **Cek**: Browser console untuk error

### Alert Terlalu Sering
- **Solusi**: Tingkatkan alert cooldown (fitur mendatang)
- **Workaround**: Saat ini cooldown 60 detik (hardcoded)

### Refresh Interval Tidak Berubah
- **Cek**: Apakah sudah save settings di Network?
- **Solusi**: Refresh halaman dashboard setelah save

---

## 🚀 Fitur Mendatang

- [ ] Kustomisasi alert cooldown per sensor
- [ ] Export/Import settings (JSON file)
- [ ] Settings untuk humidity alerts
- [ ] Email/SMS/Push notification integration
- [ ] Grafik real-time untuk sensor history
- [ ] Notifikasi browser (Web Notifications API)

---

Selamat menggunakan TOM_iTECH! 🌿
