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
});

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
  console.log("woy ono seng terhubung");
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
