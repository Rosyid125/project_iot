const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MQTT configuration
const mqttBroker = "mqtt://127.0.0.1";
const mqttTopicSensor = "sensor";
const mqttTopicServo = "servo";
const mqttTopicNilaiSensoor = "nilaiSensor";
const mqttTopicToggleSensor = "toggleSensor";
const mqttTopicToggleServo = "toggleServo";
const mqttTopicToggleSensorIn = "toggleSensorOut";
const mqttTopicToggleServoIn = "toggleServoOut";

let toggleBtnServoActive;
let toggleBtnSensorActive;
// let toggleBtnServoActiveFromDatabase;
// let toggleBtnSensorActiveFromDatabase;

const mqttClient = mqtt.connect(mqttBroker);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project_iot",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

db.query("CREATE TABLE IF NOT EXISTS toggle_state_sensor (state VARCHAR(255))", (err) => {
  if (err) {
    console.error("Error creating toggle_state_sensor table:", err);
  }
});

db.query("CREATE TABLE IF NOT EXISTS toggle_state_servo (state VARCHAR(255))", (err) => {
  if (err) {
    console.error("Error creating toggle_state_servo table:", err);
  }
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Data dari mqtt untuk dimasukkan ke database
mqttClient.on("message", (topic, message) => {
  if (topic === mqttTopicToggleSensorIn) {
    const status = message.toString();
    updateDatabaseSensor(status);
  } else if (topic === mqttTopicToggleServoIn) {
    const status = message.toString();
    updateDatabaseServo(status);
  }
});

// // Get status untuk frontendnya
// app.get("/getStatus", (req, res) => {
//   res.json({
//     sensorStatus: toggleBtnSensorActiveFromDatabase,
//     servoStatus: toggleBtnServoActiveFromDatabase,
//   });
// });

// Handle toggle button click and update database and publish MQTT message
app.post("/toggleSensor", (req, res) => {
  // Toggle the button state
  toggleBtnSensorActive = !toggleBtnSensorActive;

  // Kirim pesan ke broker MQTT sesuai dengan status tombol
  const message = toggleBtnSensorActive ? "isOn" : "isOff";
  mqttClient.publish(mqttTopicToggleSensor, message);

  // Kirim respons ke klien
  res.json({ status: "success", message: `Sent ${message} to MQTT broker` });
});

function updateDatabaseSensor(status) {
  db.query("UPDATE toggle_state_sensor SET state = ?", [status], (err) => {
    if (err) {
      console.error("Error updating toggle_state_sensor:", err);
    }
  });

  // // update status tombol untuk frontend
  // db.query("Select * FROM toggle_state_sensor", (err, results) => {
  //   if (err) {
  //     console.error("Error getting data from toggle_state_sensor:", err);
  //   }

  //   if (results.length > 0) {
  //     toggleBtnSensorActiveFromDatabase = results[0].state;
  //   }
  // });
}

app.post("/toggleServo", (req, res) => {
  // Toggle the button state
  toggleBtnServoActive = !toggleBtnServoActive;

  // Kirim pesan ke broker MQTT sesuai dengan status tombol
  const message = toggleBtnServoActive ? "isOn" : "isOff";
  mqttClient.publish(mqttTopicToggleServo, message);

  // Kirim respons ke klien
  res.json({ status: "success", message: `Sent ${message} to MQTT broker` });
});

function updateDatabaseServo(status) {
  db.query("UPDATE toggle_state_servo SET state = ?", [status], (err) => {
    if (err) {
      console.error("Error updating toggle_state_servo:", err);
    }
  });

  // // update status tombol untuk frontend
  // db.query("Select * FROM toggle_state_servo", (err, results) => {
  //   if (err) {
  //     console.error("Error getting data from toggle_state_servo:", err);
  //   }

  //   if (results.length > 0) {
  //     toggleBtnServoActiveFromDatabase = results[0].state;
  //   }
  //   console.log(toggleBtnServoActiveFromDatabase);
  // });
}

//subscribe on the server
mqttClient.on("connect", () => {
  mqttClient.subscribe([mqttTopicSensor, mqttTopicServo, mqttTopicNilaiSensoor, mqttTopicToggleSensorIn, mqttTopicToggleServoIn]); //tambahan untuk mengupdate database
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
