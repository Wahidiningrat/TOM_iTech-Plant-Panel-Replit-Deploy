#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

float soilMoisture = 0;
float temperature = 0;
float lightIntensity = 0;
float voltage = 0;

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.enableCORS(true);
  
  server.on("/data", HTTP_GET, handleDataRequest);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  readSensors();
  
  delay(100);
}

void readSensors() {
  soilMoisture = analogRead(34) / 40.95;
  
  temperature = 25.0 + (analogRead(35) / 4095.0) * 10.0;
  
  lightIntensity = analogRead(36) / 4.095;
  
  voltage = (analogRead(39) / 4095.0) * 3.3 * 5.0;
}

void handleDataRequest() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  String json = "{";
  json += "\"soilMoisture\":" + String(soilMoisture, 2) + ",";
  json += "\"temperature\":" + String(temperature, 2) + ",";
  json += "\"lightIntensity\":" + String(lightIntensity, 2) + ",";
  json += "\"voltage\":" + String(voltage, 2);
  json += "}";
  
  server.send(200, "application/json", json);
}
