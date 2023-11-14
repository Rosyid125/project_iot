const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Inisialisasi MQTT client
const mqttClient = mqtt.connect("mqtt://127.0.0.1"); // Ganti dengan alamat broker MQTT Anda

// Middleware untuk menangani permintaan statis
app.use(express.static("public"));

// Setel server web untuk mendengarkan port tertentu
const port = 3000;
server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Mengatur rute untuk tampilan web
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Menangani koneksi soket
io.on("connection", (socket) => {
  console.log("Klien terhubung");

  // Menerima data dari mikrokontrol melalui MQTT
  mqttClient.subscribe("sensor");
  mqttClient.subscribe("servo");

  mqttClient.on("message", (topic, message) => {
    if (topic === "sensor" || topic === "servo") {
      socket.emit("data", { topic, message: message.toString() });
    }
  });

  // Menangani pemutusan koneksi
  socket.on("disconnect", () => {
    console.log("Klien terputus");
  });
});
