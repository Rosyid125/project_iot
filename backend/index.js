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

const client = mqtt.connect("mqtt://127.0.0.1");
client.on("connect", () => {
  console.log("mqtt berjalan om");
  client.subscribe("sensor");
  client.subscribe("servo");
  client.subscribe("nilaiSensor");
});

const app = express();
dotenv.config();

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

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

io.on("connection", (socket) => {
  socket.on("toggleServo", (data) => {
    client.publish("toggleServo", data);
  });

  socket.on("toggleSensor", (data) => {
    client.publish("toggleSensor", data);
  });

  client.on("message", (topic, message) => {
    if (topic == "sensor") {
      socket.emit("sensor", message.toString());
    } else if (topic == "servo") {
      socket.emit("servo", message.toString());
    } else if (topic == "nilaiSensor") {
      socket.emit("nilaiSensor", message.toString());
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

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoute);
app.use(authRoute);
app.use(mqttRoute);

server.listen(process.env.app_port, () => {
  console.log("server is running on port 8080 🚀");
});
