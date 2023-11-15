const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MQTT configuration
const mqttBroker = "mqtt://127.0.0.1";
const mqttTopicSensor = "sensor";
const mqttTopicServo = "servo";
const mqttTopicNilaiSensoor = "nilaiSensor";

const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on("connect", () => {
  mqttClient.subscribe([mqttTopicSensor, mqttTopicServo, mqttTopicNilaiSensoor]);
});

wss.on("connection", (ws) => {
  ws.on("close", () => {
    console.log("WebSocket closed");
  });
});

mqttClient.on("message", (topic, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message: message.toString() }));
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
