import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import io from "socket.io-client";
import { io } from "socket.io-client";
import "../assets/control.css";

const Welcome = () => {
  const [sensor, setSensor] = useState([]);
  const [servo, setServo] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [toggleSensor, setToggleSensor] = useState(false);
  const [toggleServo, setToggleServo] = useState(false);

  // const { user } = useSelector((state) => state.auth);
  const socket = io("http://localhost:8080");
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("sensor", (data) => {
    setSensor(data);
  });

  socket.on("servo", (data) => {
    setServo(data);
  });

  socket.on("nilaiSensor", (data) => {
    setNilai(data);
  });

  useEffect(() => {
    if (toggleServo == true) {
      socket.emit("toggleServo", "isOn");
    } else {
      socket.emit("toggleServo", "isOff");
    }
  }, [toggleServo]);
  useEffect(() => {
    if (toggleSensor == true) {
      socket.emit("toggleSensor", "isOn");
    } else {
      socket.emit("toggleSensor", "isOff");
    }
  }, [toggleSensor]);

  // toggleBtnSensor.addEventListener("click", () => {
  //   if (toggleBtnSensor.checked) {
  //     socket.emit("toggleSensor", "isOn");
  //   } else {
  //     socket.emit("toggleSensor", "isOff");
  //   }
  // });
  // toggleBtnServo.addEventListener("click", () => {
  //   if (toggleBtnServo.checked) {
  //     socket.emit("toggleServo", "isOn");
  //   } else {
  //     socket.emit("toggleServo", "isOff");
  //   }
  // });

  return (
    <div>
      {/* <h1 className="title pt-5">Control</h1>
      <h2 className="subtitle ">
        Welcome Back <strong>{user && user.name}</strong>
      </h2> */}
      <div className="columns">
        <div className="column">
          <div className="box">
            <h3 className="title is-5">Status Sensor</h3>
            <div className="content">
              <h4 className="title is-1">{sensor}</h4>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="box">
            <h3 className="title is-5">Status Servor</h3>
            <div className="content">
              <h4 className="title is-1">{servo}</h4>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="box">
            <h3 className="title is-5">Nilai Sensor</h3>
            <div className="content">
              <h4 className="title is-1">{nilai}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="controlSwitch">
        <div className="button-control col">
          <h3>Switch Sensor</h3>
          <label className="switch">
            <input type="checkbox" id="toggleBtnSensor" />
            <span
              className="Slider switchOnOff"
              onClick={() => {
                if (toggleSensor == false) {
                  setToggleSensor(true);
                } else {
                  setToggleSensor(false);
                }
              }}
            ></span>
          </label>
        </div>
        <div className="button-control col">
          <h3>Switch Servo</h3>
          <label className="switch">
            <input type="checkbox" id="toggleBtnServo" />
            <span
              className="Slider switchOnOff"
              onClick={() => {
                if (toggleServo == false) {
                  setToggleServo(true);
                } else {
                  setToggleServo(false);
                }
              }}
            ></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
