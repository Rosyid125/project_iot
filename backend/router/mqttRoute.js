import express from "express";
import { dataMqtt, dataMqttSensor, dataMqttServo } from "../control/mqtt.js";

const router = express.Router();

router.get("/mqtt", dataMqtt);
router.post("/mqttSensor", dataMqttSensor);
router.post("/mqttServo", dataMqttServo);

export default router;
