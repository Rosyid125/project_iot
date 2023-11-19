import express from "express";
import { dataMqtt } from "../control/mqtt.js";

const router = express.Router();

router.get("/mqtt", dataMqtt);

export default router;
