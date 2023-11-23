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

let toggleSensor = false; // Initialize to false by default
let toggleServo = false; // Initialize to false by default

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

// // sementara di matikan dulu
// function updateDatabaseSensor(status) {
//   if (status == "true") {
//     db.query("UPDATE toggle_state_sensor SET state = true", (err, results) => {
//       if (err) {
//         console.error("Error updating toggle_state_sensor table:", err);
//       } else {
//         console.log("Update successful. Rows affected: " + results.affectedRows);
//       }
//     });
//   } else if (status == "false") {
//     db.query("UPDATE toggle_state_sensor SET state = false", (err, results) => {
//       if (err) {
//         console.error("Error updating toggle_state_sensor table:", err);
//       } else {
//         console.log("Update successful. Rows affected: " + results.affectedRows);
//       }
//     });
//   }
// }

// function updateDatabaseServo(status) {
//   if (status == "true") {
//     db.query("UPDATE toggle_state_servo SET state = true", (err, results) => {
//       if (err) {
//         console.error("Error updating toggle_state_servo table:", err);
//       } else {
//         console.log("Update successful. Rows affected: " + results.affectedRows);
//       }
//     });
//   } else if (status == "false") {
//     db.query("UPDATE toggle_state_servo SET state = false", (err, results) => {
//       if (err) {
//         console.error("Error updating toggle_state_servo table:", err);
//       } else {
//         console.log("Update successful. Rows affected: " + results.affectedRows);
//       }
//     });
//   }
// }

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
  // tampilkan pesan di console pesan yang dikirimkan
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
    } else if (topic == "toggleSensorOut") {
      const status = message.toString();
      // updateDatabaseSensor(status);
      // console.log(status);
    } else if (topic == "toggleServoOut") {
      const status = message.toString();
      // updateDatabaseServo(status);
      // console.log(status);
    } else if (topic == "toggleSensor") {
      console.log("toggleSensor data: " + message.toString());
      socket.emit("toggleSensor", message.toString());
    } else if (topic == "toggleServo") {
      console.log("toggleServo data: " + message.toString());
      socket.emit("toggleServo", message.toString());
    }
  });

  //   // Fetch initial toggle states and send them to the connected client
  //   db.query("SELECT * FROM toggle_state_sensor", (err, results) => {
  //     if (err) {
  //       console.error("Error executing query:", err);
  //     } else {
  //       console.log("Query results:", results);
  //       if (results.length > 0) {
  //         toggleSensor = results[0].state;
  //         socket.emit("toggleSensor", toggleSensor);
  //       }
  //     }
  //   });

  //   db.query("SELECT * FROM toggle_state_servo", (err, results) => {
  //     if (err) {
  //       console.error("Error executing query:", err);
  //     } else {
  //       console.log("Query results:", results);
  //       if (results.length > 0) {
  //         toggleServo = results[0].state;
  //         socket.emit("toggleServo", toggleServo);
  //       }
  //     }
  //   });
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
// app.use(router);

server.listen(process.env.app_port, () => {
  console.log("server is running on port 8080 🚀");
});
