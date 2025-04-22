#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <LiquidCrystal.h>
#include <SoftwareSerial.h>

#define BUZZER_PIN D0
#define LED_PIN 10
#define MQ4_SENSOR_PIN A0

// LCD
LiquidCrystal lcd(D3, D4, D5, D6, D7, D8);
// RS, E, D4, D5, D6, D7

// Bluetooth Serial to Arduino Uno
SoftwareSerial BTSerial(D1, D2);  // D1 = TX, D2 = RX

const char* ssid = "TP-Link_6654";
const char* password = "99682293";
const char* mqttServer = "192.168.0.101";

const char* controlTopic = "esp8266/control";  // Receiving from Unity
const char* dataTopic = "esp8266/data";        // Sending to Unity

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastSendTime = 0;

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("MQTT Message Received: " + message);

  if (String(topic) == controlTopic) {
    handleCommand(message.charAt(0));

    // Send to Arduino Uno via Bluetooth
    BTSerial.write(message.charAt(0));
    Serial.println("Sent to Arduino via BTSerial: " + message);
  }
}

void setup() {
  Serial.begin(115200);
  BTSerial.begin(9600);  // Bluetooth baud rate

  lcd.setCursor(0, 0);
  lcd.begin(16, 2);
  lcd.print("Smart Lab Ready");

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(MQ4_SENSOR_PIN, INPUT);
  digitalWrite(BUZZER_PIN, HIGH);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Connect to MQTT Broker
  client.setServer(mqttServer, 1883);
  client.setCallback(callback);

  while (!client.connected()) {
    if (client.connect("ESP8266Client")) {
      Serial.println("Connected to MQTT Broker!");
      client.subscribe(controlTopic);
    } else {
      delay(5000);
    }
  }
}

void loop() {
  client.loop();
}

void handleCommand(char cmd) {
  switch (cmd) {
    case 'E':
      digitalWrite(BUZZER_PIN, LOW);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Emergency!");
      delay(2000);
      digitalWrite(BUZZER_PIN, HIGH);
      delay(2000);
      digitalWrite(BUZZER_PIN, LOW);
      delay(2000);
      digitalWrite(BUZZER_PIN, HIGH);
      lcd.clear();
      lcd.print("Buzzer Off");
      break;
    case 'e':
      if (analogRead(MQ4_SENSOR_PIN) > 1000) {
        client.publish(dataTopic, "G");  // Gas detected
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Gas Alert!");
        Serial.println("Gas Alert!");
        digitalWrite(BUZZER_PIN, LOW);
        delay(1000);
        digitalWrite(BUZZER_PIN, HIGH);
        delay(1000);
        digitalWrite(BUZZER_PIN, LOW);
        delay(1000);
        digitalWrite(BUZZER_PIN, HIGH);
        delay(1000);
        digitalWrite(BUZZER_PIN, LOW);
        delay(1000);
        digitalWrite(BUZZER_PIN, HIGH);
        delay(1000);
        digitalWrite(BUZZER_PIN, LOW);
        delay(1000);
        digitalWrite(BUZZER_PIN, HIGH);
      }
      break;
    case 'X':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Door Opend!");
      break;
    case 'D':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Door Closed!");
      break;
    case 'N':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Door Opend!");
      break;
    case 'x':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Window Opend!");
      break;
    case 'd':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Window Closed!");
      break;
    case 'n':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Window Opend!");
      break;
    case 'A':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("ArmRobot Moving!");
      break;
    case 'F':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Product Line On!");
      break;
    case 'S':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Product Line Off!");
      break;
    case 'B':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Product Line On!");
      break;
    case 'L':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Led On!");
      break;
    case 'l':
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Led Off!");
      break;
    default:
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Command : Unkown");
      break;
  }
}
