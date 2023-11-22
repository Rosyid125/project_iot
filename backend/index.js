import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import userRoute from "./router/userRoute.js";
import authRoute from "./router/authRoute.js";
import SequelizStore from "connect-session-sequelize";
import bodyParser from "body-parser";
import mqttRoute from "./router/mqttRoute.js";
import http from "http";
import { Server } from "socket.io";
import mqtt from "mqtt";

// mqtt coy
const client = mqtt.connect("mqtt://127.0.0.1");
client.on("connect", () => {
  console.log("index mqtt konek coy");
  client.subscribe("sensor");
  client.subscribe("servo");
  client.subscribe("nilaiSensor");
  client.subscribe("toggleSensorOut");
  client.subscribe("toggleServoOut");
  client.publish("toggleSensor");
  client.publish("toggleServo");
});

//create table
// db.query("CREATE TABLE IF NOT EXISTS toggle_state_sensor (state VARCHAR(255))", (err) => {
//   if (err) {
//     console.error("Error creating toggle_state_sensor table:", err);
//   }
// });

// db.query("CREATE TABLE IF NOT EXISTS toggle_state_servo (state VARCHAR(255))", (err) => {
//   if (err) {
//     console.error("Error creating toggle_state_servo table:", err);
//   }
// });

function updateDatabaseSensor(status) {
  db.query("UPDATE togle_state_sensor SET state = ?", [status], (err) => {
    if (err) {
      console.error("Error updating toggle_state_sensor table:", err);
    }
  });
}

function updateDatabaseServo(status) {
  db.query("UPDATE togle_state_servo SET state = ?", [status], (err) => {
    if (err) {
      console.error("Error updating toggle_state_servo table:", err);
    }
  });
}

dotenv.config();

const app = express();

//session configuration
const sessionStore = SequelizStore(session.Store);

const store = new sessionStore({
  db: db,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow to everyone
  },
});

io.on("connection", (socket) => {
  // tampilkan pesan di console pesan yang dikirimkan

  socket.on("toggleServo", (data) => {
    client.publish("toggleServo", data);
  });

  socket.on("toggleSensor", (data) => {
    client.publish("toggleSensor", data);
  });
  
  client.on("message", (topic, message) => {
    if (topic == "sensor") {
      console.log("sensor data: " + message.toString());
      socket.emit("sensor", message.toString());
    } else if (topic == "servo") {
      console.log("servo data: " + message.toString());
      socket.emit("servo", message.toString());
    } else if (topic == "nilaiSensor") {
      console.log("nilai sensor data: " + message.toString());
      socket.emit("nilaiSensor", message.toString());
    } else if (topic == "toggleSensorOut") {
      const status = message.toString();
      updateDatabaseSensor(status);
    } else if (topic == "toggleServoOut") {
      const status = message.toString();
      updateDatabaseServo(status);
    } else if (topic == "toggleSensor") {
      console.log("toggleSensor data: " + message.toString());
      socket.emit("toggleSensor", message.toString());
    } else if (topic == "toggleServo") {
      console.log("toggleServo data: " + message.toString());
      socket.emit("toggleServo", message.toString());
    }
  });
});

app.use(
  session({
    secret: process.env.sess_secret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoute);
app.use(authRoute);
app.use(mqttRoute);
// app.use(router);

server.listen(process.env.app_port, () => {
  console.log("server is running on port 8080 🚀");
});
