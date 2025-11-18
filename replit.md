# TOM_iTECH Plant Panel

> Smart IoT Plant Monitoring System Dashboard

## Overview

**TOM_iTECH Plant Panel** is an IoT-based plant monitoring system project designed to display and analyze real-time plant conditions including:
- 🌡️ Environmental temperature
- 💧 Air humidity
- 🌱 Soil moisture
- ☀️ Light intensity

This is a frontend-only dashboard built with HTML, CSS, and vanilla JavaScript. The project includes:
- Landing page with navigation
- User authentication (login/profile using localStorage)
- Main monitoring dashboard with sensor data visualization
- AI chat integration (using Gemini API)
- Settings and user profile pages

## Project Structure

```
.
├── index.html              # Landing page
├── index.css               # Landing page styles
├── index.js                # Landing page logic (login state management)
├── dashbord.html           # Main monitoring dashboard
├── dashbord.css            # Dashboard styles
├── dashbord.js             # ESP32 connection & data fetching logic
├── loginpage.html          # Login page
├── loginpage.js            # Login logic
├── userprofile.html        # User profile page
├── AIchat.html             # AI chat interface
├── script.js               # Gemini API integration
├── setting.html            # Settings page
├── Features.html           # Features page
├── overview.html           # Overview page
├── credit.html             # Contributors page
├── ESP32_EXAMPLE.ino       # Example ESP32 Arduino code
├── ESP32_SETUP_GUIDE.md    # Comprehensive ESP32 setup guide
├── SETTINGS_GUIDE.md       # Complete settings & alerts guide
└── README.md               # Project documentation
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| IoT Hardware | ESP32 (WiFi enabled) |
| IoT Communication | HTTP/JSON (direct local connection) |
| AI Integration | Google Gemini API |
| Storage | localStorage (for login state & ESP32 IP) |
| Server | Python HTTP Server (development) |

## Running the Application

The application is configured to run on port 5000 using Python's built-in HTTP server:
```bash
python -m http.server 5000 --bind 0.0.0.0
```

The workflow "Start application" is configured to automatically start the server.

## Recent Changes

- **2025-11-18**: Added Smart Settings & Alert System
  - Updated `setting.js` to save/load settings from localStorage
  - Settings now persist after clicking "Save Settings"
  - Integrated threshold alerts for temperature and soil moisture sensors
  - Real-time alerts when sensor values exceed configured thresholds
  - Visual and audio alert notifications (configurable)
  - Alert cooldown system to prevent alert spam
  - Configurable auto-refresh interval from settings
  - ESP32 IP can be configured in Network Settings
  - All settings survive page reloads and browser restarts

- **2025-11-18**: Added ESP32 Direct Connection Support
  - Created `dashbord.js` for ESP32 local network communication
  - Dashboard can now fetch real-time sensor data from ESP32 via HTTP
  - Added IP configuration UI (click "+" button on dashboard)
  - Auto-refresh data every 5 seconds (configurable in settings)
  - Real-time chart updates for soil moisture
  - Connection status indicator with error handling
  - **All sensor values reset to 0 when ESP32 is not connected**
  - **Device table is cleared when ESP32 is disconnected**
  - Created `ESP32_EXAMPLE.ino` Arduino sketch template
  - Added comprehensive `ESP32_SETUP_GUIDE.md` documentation

- **2025-11-18**: Initial Replit setup
  - Installed Python 3.11 for serving static files
  - Configured workflow to run on port 5000
  - Added .gitignore for Python and Replit files
  - Created project documentation

## Deployment

This project is configured for static deployment on Replit. The deployment serves all HTML, CSS, and JavaScript files directly without any build process.

## ESP32 Integration

The dashboard now supports **direct connection to ESP32** on your local network:

### How It Works:
1. ESP32 runs a simple HTTP server on your WiFi network
2. Dashboard fetches sensor data via HTTP GET requests to `http://[ESP32_IP]/data`
3. Data updates automatically every 5 seconds
4. No backend server required - pure client-to-device communication

### Setup:
1. Upload `ESP32_EXAMPLE.ino` to your ESP32
2. Configure WiFi credentials in the Arduino code
3. Note the ESP32's IP address from Serial Monitor
4. Open the dashboard and click the "+" button
5. Enter the ESP32 IP address

### Expected JSON Response from ESP32:
```json
{
  "soilMoisture": 65.5,
  "temperature": 27.3,
  "lightIntensity": 750,
  "voltage": 12.8
}
```

For detailed setup instructions, see `ESP32_SETUP_GUIDE.md`.

## Settings & Alerts

The application features a comprehensive settings system accessible from `setting.html`:

### Sensor Settings
- **Temperature Sensor**: Configure min/max temperature alerts (default: 15-35°C)
- **Humidity Sensor**: Set humidity thresholds
- **Soil Moisture Sensor**: Configure moisture alerts (default: 20-80%)
- All sensors have configurable sampling intervals and alert toggles

### Actuator Settings
- **Irrigation Pump**: Set duration and auto-irrigation moisture level
- **Ventilation Fan**: Configure speed and auto-temperature trigger

### Network Settings
- **ESP32 IP Address**: Configure your ESP32's IP
- **Auto-Refresh Interval**: Set how often data refreshes (1-60 seconds)

### Notification Alerts
- **Alert Types**: Email, SMS, Push notifications
- **Alert Sound**: Enable/disable audio alerts
- **Alert Cooldown**: Prevent alert spam (default: 5 minutes)

### How Alerts Work:
1. Configure thresholds in Settings (e.g., Temperature: 15-35°C)
2. Enable alerts for that sensor
3. When ESP32 data exceeds thresholds, dashboard shows:
   - Visual alert box (top-right corner)
   - Optional audio notification
   - Alert auto-dismisses after 5 seconds
4. Alerts have 60-second cooldown to prevent spam

All settings are saved to localStorage and persist across sessions.

## Notes

- The Gemini API key is currently hardcoded in `script.js` (line 4). For production use, this should be moved to environment variables.
- User authentication is client-side only using localStorage - not suitable for production without backend validation.
- ESP32 and the device viewing the dashboard must be on the **same WiFi network** for local communication to work.
- Settings are stored in browser localStorage - clearing browser data will reset all settings.
