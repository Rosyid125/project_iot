import express from "express";
import mqtt from "mqtt";
import http from "http";
import WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//mqtt configuration
const mqttBroker = "mqtt://127.0.0.1";
const mqttTopicSensor = "sensor";
const mqttTopicServo = "servo";
const mqttTopicNilaiSensoor = "nilaiSensor";

const mqttClient = mqtt.connect(mqttBroker);

// Global variables to store MQTT data
let sensorData = null;
let servoData = null;
let nilaiSensorData = null;

//mqtt connect sekaligus handlenya

mqttClient.on("connect", () => {
  mqttClient.subscribe(mqttTopicSensor);
  mqttClient.subscribe(mqttTopicServo);
  mqttClient.subscribe(mqttTopicNilaiSensoor);

  console.log("MQTT Connected");
});

mqttClient.on("message", (topic, message) => {
  // Update global variables based on the MQTT topic
  if (topic === mqttTopicSensor) {
    sensorData = message.toString();
  } else if (topic === mqttTopicServo) {
    servoData = message.toString();
  } else if (topic === mqttTopicNilaiSensoor) {
    nilaiSensorData = message.toString();
  }
});

// function handleMqttData() {
//   console.log("Sensor Data:", sensorData);
//   console.log("Servo Data:", servoData);
//   console.log("Nilai Sensor Data:", nilaiSensorData);

//   // Perform additional actions or processing based on the updated data
//   // ...
// }

// mqttClient.on("message", (topic, message) => {
//   if (topic === mqttTopicServo) {
//     // Log the received message for the "servo" topic
//     console.log(`Received message on ${topic}: ${message.toString()}`);
//     // Add your logic to handle the servo data here
//   }
// });

mqttClient.on("error", (error) => {
  console.error("MQTT Connection Error:", error);
});

//websocket configuration

wss.on("connection", (ws) => {
  ws.on("close", () => {
    console.log("client close connection");
  });
});

//mqtt handle message

mqttClient.on("message", (topic, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message: message.toString() }));
    }
  });
});

export const dataMqtt = async (req, res) => {
  try {
    // Instead of sending the topic values, send the values from your MQTT configuration
    res.status(200).json({
      sensorData,
      servoData,
      nilaiSensorData,
    });
  } catch (error) {
    console.error("MQTT Publish Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
