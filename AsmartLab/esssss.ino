#include <Servo.h>
#include <SoftwareSerial.h>

// HC-05 Bluetooth Serial
SoftwareSerial BTSerial(0, 1);  // RX, TX (to ESP's BT TX/RX)

// Servo Pins
#define DOOR_SERVO_PIN 3
#define WINDOW_SERVO_PIN 4


// DC Motor (L298N)
#define ENA 7
#define IN1 6
#define IN2 5

// LED
#define LED_PIN 11

// Servos
Servo doorServo;
Servo windowServo;


void setup() {
  Serial.begin(9600);    // For debugging
  BTSerial.begin(9600);  // Communication with ESP8266 (via HC-05)

  // Attach Servos
  doorServo.attach(DOOR_SERVO_PIN);
  windowServo.attach(WINDOW_SERVO_PIN);


  // Motor Pins
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  // LED
  pinMode(LED_PIN, OUTPUT);

  // Initialize
  doorServo.write(90);
  windowServo.write(90);
  stopMotor();
  digitalWrite(LED_PIN, LOW);
}

void loop() {
  if (BTSerial.available()) {
    char cmd = BTSerial.read();
    Serial.print("Received via BT: ");
    Serial.println(cmd);

    switch (cmd) {
      case 'X': doorServo.write(180); break;          // Forward Door
      case 'D': doorServo.write(90); break;          // Close Door
      case 'N': doorServo.write(0); break;           // Backward Door
      case 'x': windowServo.write(180); break;        // Forward Window
      case 'd': windowServo.write(90); break;        // Close Window
      case 'n': windowServo.write(0); break;         // Backward Window
      case 'F': forwardmotor(); break;              // Forward DC Motor
      case 'S': stopMotor(); break;                  // Turn OFF DC Motor
      case 'B': backwardmotor(); break;              // Backward DC Motor
      case 'L': digitalWrite(LED_PIN, HIGH); break;  // Turn ON LED
      case 'l': digitalWrite(LED_PIN, LOW); break;   // Turn OFF LED
      default: Serial.println("Unknown command.");
    }
  }
}


void forwardmotor() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 150);  // Speed (0–255)
}

void backwardmotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 100);  // Speed (0–255)
}
void stopMotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);
}
