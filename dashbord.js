const ESP32_CONFIG_KEY = 'esp32_ip';
const SETTINGS_STORAGE_KEY = 'tom_itech_settings';
const DEFAULT_REFRESH_INTERVAL = 5000;
let refreshTimer = null;
let soilMoistureHistory = [];
let lastAlertTime = {};

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function getRefreshInterval() {
    const settings = loadSettings();
    const networkSettings = settings.networkSettings;
    if (networkSettings && networkSettings.refreshInterval) {
        return parseInt(networkSettings.refreshInterval) * 1000;
    }
    return DEFAULT_REFRESH_INTERVAL;
}

function checkThresholdAlert(sensorType, value, settings) {
    if (!settings || !settings.enableAlerts) {
        return null;
    }
    
    const now = Date.now();
    const cooldown = 60000;
    
    if (lastAlertTime[sensorType] && (now - lastAlertTime[sensorType] < cooldown)) {
        return null;
    }
    
    let alertMessage = null;
    
    if (sensorType === 'temperature' && settings.minTempAlert !== undefined && settings.maxTempAlert !== undefined) {
        if (value < parseFloat(settings.minTempAlert)) {
            alertMessage = `⚠️ ALERT: Temperature too low (${value}°C < ${settings.minTempAlert}°C)`;
        } else if (value > parseFloat(settings.maxTempAlert)) {
            alertMessage = `⚠️ ALERT: Temperature too high (${value}°C > ${settings.maxTempAlert}°C)`;
        }
    } else if (sensorType === 'soilMoisture' && settings.minMoistureAlert !== undefined && settings.maxMoistureAlert !== undefined) {
        if (value < parseFloat(settings.minMoistureAlert)) {
            alertMessage = `⚠️ ALERT: Soil too dry (${value}% < ${settings.minMoistureAlert}%)`;
        } else if (value > parseFloat(settings.maxMoistureAlert)) {
            alertMessage = `⚠️ ALERT: Soil too wet (${value}% > ${settings.maxMoistureAlert}%)`;
        }
    }
    
    if (alertMessage) {
        lastAlertTime[sensorType] = now;
        showAlert(alertMessage);
    }
    
    return alertMessage;
}

function showAlert(message) {
    const allSettings = loadSettings();
    const notificationSettings = allSettings.notificationAlerts;
    
    let alertBox = document.getElementById('threshold-alert-box');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'threshold-alert-box';
        alertBox.style.cssText = 'position: fixed; top: 80px; right: 20px; background: #ff9800; color: white; padding: 15px 20px; border-radius: 8px; font-weight: bold; z-index: 1000; box-shadow: 0 4px 8px rgba(0,0,0,0.3); max-width: 300px;';
        document.body.appendChild(alertBox);
    }
    
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    
    if (notificationSettings && notificationSettings.alertSound) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

function getESP32IP() {
    return localStorage.getItem(ESP32_CONFIG_KEY) || '';
}

function setESP32IP(ip) {
    localStorage.setItem(ESP32_CONFIG_KEY, ip);
}

function showConfigDialog() {
    const currentIP = getESP32IP();
    const newIP = prompt('Masukkan IP Address ESP32 Anda (contoh: 192.168.1.100):', currentIP);
    
    if (newIP !== null && newIP.trim() !== '') {
        setESP32IP(newIP.trim());
        updateConnectionStatus('Konfigurasi disimpan. Mencoba koneksi...', 'info');
        fetchSensorData();
    }
}

function updateConnectionStatus(message, type = 'info') {
    let statusEl = document.getElementById('connection-status');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'connection-status';
        statusEl.style.cssText = 'padding: 10px; margin: 10px; border-radius: 8px; text-align: center; font-size: 14px;';
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(statusEl, mainContent.firstChild);
        }
    }
    
    statusEl.textContent = message;
    
    if (type === 'success') {
        statusEl.style.backgroundColor = '#d4edda';
        statusEl.style.color = '#155724';
        statusEl.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        statusEl.style.backgroundColor = '#f8d7da';
        statusEl.style.color = '#721c24';
        statusEl.style.border = '1px solid #f5c6cb';
    } else {
        statusEl.style.backgroundColor = '#d1ecf1';
        statusEl.style.color = '#0c5460';
        statusEl.style.border = '1px solid #bee5eb';
    }
}

function updateSoilMoistureChart(value) {
    soilMoistureHistory.push(value);
    if (soilMoistureHistory.length > 10) {
        soilMoistureHistory.shift();
    }
    
    const chartSvg = document.querySelector('.line-chart');
    if (chartSvg && soilMoistureHistory.length > 1) {
        const polyline = chartSvg.querySelector('.data1');
        if (polyline) {
            const points = soilMoistureHistory.map((val, idx) => {
                const x = (idx / (soilMoistureHistory.length - 1)) * 240;
                const y = 100 - val;
                return `${x},${y}`;
            }).join(' ');
            polyline.setAttribute('points', points);
        }
    }
}

function updateDashboard(data) {
    const allSettings = loadSettings();
    
    if (data.soilMoisture !== undefined) {
        const soilPercent = parseFloat(data.soilMoisture);
        updateSoilMoistureChart(soilPercent);
        const soilCard = document.querySelector('[aria-label="Soil Moisture monitoring"]');
        if (soilCard) {
            const smallText = soilCard.querySelector('small');
            if (smallText) {
                smallText.textContent = `Nilai saat ini: ${soilPercent.toFixed(1)}%`;
            }
        }
        
        const soilSettings = allSettings.soilMoistureSensor;
        if (soilSettings) {
            checkThresholdAlert('soilMoisture', soilPercent, soilSettings);
        }
    }
    
    if (data.lightIntensity !== undefined) {
        const lightValue = parseFloat(data.lightIntensity);
        const lightCard = document.querySelector('[aria-label="Light Intensity"]');
        if (lightCard) {
            const meter = lightCard.querySelector('.meter.light div');
            const valueText = lightCard.querySelector('.percent-used strong');
            if (meter) {
                const percentage = Math.min(100, (lightValue / 1000) * 100);
                meter.style.width = `${percentage}%`;
            }
            if (valueText) {
                valueText.textContent = lightValue.toFixed(0);
            }
        }
    }
    
    if (data.temperature !== undefined) {
        const tempValue = parseFloat(data.temperature);
        const tempCard = document.querySelector('[aria-label="Temperature monitoring"]');
        if (tempCard) {
            const meter = tempCard.querySelector('.meter.temp div');
            const valueText = tempCard.querySelector('.percent-used strong');
            if (meter) {
                const percentage = Math.min(100, (tempValue / 50) * 100);
                meter.style.width = `${percentage}%`;
            }
            if (valueText) {
                valueText.textContent = tempValue.toFixed(1);
            }
        }
        
        const tempSettings = allSettings.temperatureSensor;
        if (tempSettings) {
            checkThresholdAlert('temperature', tempValue, tempSettings);
        }
    }
    
    if (data.voltage !== undefined) {
        const voltValue = parseFloat(data.voltage);
        const voltCard = document.querySelector('[aria-label="Voltage monitoring"]');
        if (voltCard) {
            const meter = voltCard.querySelector('.meter.voltage div');
            const valueText = voltCard.querySelector('.percent-used strong');
            if (meter) {
                const percentage = Math.min(100, (voltValue / 15) * 100);
                meter.style.width = `${percentage}%`;
            }
            if (valueText) {
                valueText.textContent = voltValue.toFixed(1);
            }
        }
    }
    
    const lastUpdate = new Date().toLocaleTimeString('id-ID');
    updateDeviceStatus('Kelembapan Tanah', 'Online', 'Baru saja');
    updateDeviceStatus('Intensitas Cahaya', 'Online', 'Baru saja');
    updateDeviceStatus('Suhu', 'Online', 'Baru saja');
    updateDeviceStatus('Tegangan', 'Online', 'Baru saja');
}

function updateDeviceStatus(deviceName, status, lastUpdate) {
    const table = document.querySelector('[aria-label="List of connected devices"] tbody');
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[0] && cells[0].textContent === deviceName) {
                if (cells[1]) cells[1].textContent = status;
                if (cells[2]) cells[2].textContent = lastUpdate;
            }
        });
    }
}

function clearDeviceTable() {
    const table = document.querySelector('[aria-label="List of connected devices"] tbody');
    if (table) {
        table.innerHTML = '';
    }
}

function populateDeviceTable() {
    const table = document.querySelector('[aria-label="List of connected devices"] tbody');
    if (table && table.children.length === 0) {
        table.innerHTML = `
            <tr><td>Kelembapan Tanah</td><td>Online</td><td>Baru saja</td></tr>
            <tr><td>Intensitas Cahaya</td><td>Online</td><td>Baru saja</td></tr>
            <tr><td>Suhu</td><td>Online</td><td>Baru saja</td></tr>
            <tr><td>Tegangan</td><td>Online</td><td>Baru saja</td></tr>
        `;
    }
}

function resetAllSensorValues() {
    soilMoistureHistory = [];
    
    const soilCard = document.querySelector('[aria-label="Soil Moisture monitoring"]');
    if (soilCard) {
        const smallText = soilCard.querySelector('small');
        if (smallText) {
            smallText.textContent = 'Nilai saat ini: 0.0%';
        }
        const chartSvg = soilCard.querySelector('.line-chart');
        if (chartSvg) {
            const polyline = chartSvg.querySelector('.data1');
            if (polyline) {
                polyline.setAttribute('points', '0,100 240,100');
            }
        }
    }
    
    const lightCard = document.querySelector('[aria-label="Light Intensity"]');
    if (lightCard) {
        const meter = lightCard.querySelector('.meter.light div');
        const valueText = lightCard.querySelector('.percent-used strong');
        if (meter) {
            meter.style.width = '0%';
        }
        if (valueText) {
            valueText.textContent = '0';
        }
    }
    
    const tempCard = document.querySelector('[aria-label="Temperature monitoring"]');
    if (tempCard) {
        const meter = tempCard.querySelector('.meter.temp div');
        const valueText = tempCard.querySelector('.percent-used strong');
        if (meter) {
            meter.style.width = '0%';
        }
        if (valueText) {
            valueText.textContent = '0.0';
        }
    }
    
    const voltCard = document.querySelector('[aria-label="Voltage monitoring"]');
    if (voltCard) {
        const meter = voltCard.querySelector('.meter.voltage div');
        const valueText = voltCard.querySelector('.percent-used strong');
        if (meter) {
            meter.style.width = '0%';
        }
        if (valueText) {
            valueText.textContent = '0.0';
        }
    }
    
    clearDeviceTable();
}

async function fetchSensorData() {
    const esp32IP = getESP32IP();
    
    if (!esp32IP) {
        updateConnectionStatus('⚙️ Klik tombol "+" untuk konfigurasi IP ESP32', 'info');
        return;
    }
    
    try {
        const url = `http://${esp32IP}/data`;
        updateConnectionStatus(`🔄 Mengambil data dari ${esp32IP}...`, 'info');
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        populateDeviceTable();
        updateDashboard(data);
        updateConnectionStatus(`✅ Terhubung ke ESP32 (${esp32IP}) - Diperbarui: ${new Date().toLocaleTimeString('id-ID')}`, 'success');
        
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        updateConnectionStatus(`❌ Gagal terhubung ke ESP32 (${esp32IP}). Pastikan ESP32 aktif dan di jaringan yang sama. Error: ${error.message}`, 'error');
        
        resetAllSensorValues();
    }
}

function startAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    
    fetchSensorData();
    
    const interval = getRefreshInterval();
    refreshTimer = setInterval(() => {
        fetchSensorData();
    }, interval);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', showConfigDialog);
        addBtn.title = 'Konfigurasi IP ESP32';
    }
    
    const esp32IP = getESP32IP();
    if (esp32IP) {
        startAutoRefresh();
    } else {
        updateConnectionStatus('⚙️ Klik tombol "+" untuk konfigurasi IP ESP32 Anda', 'info');
        resetAllSensorValues();
    }
});

window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});
