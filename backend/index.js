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

dotenv.config();

const app = express();

//session configuration
const sessionStore = SequelizStore(session.Store);

const store = new sessionStore({
  db: db,
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

app.listen(process.env.app_port, () => {
  console.log("server is running on port 8080");
});
