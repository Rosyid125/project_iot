import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../assets/control.css";

const Welcome = () => {
  const [sensor, setSensor] = useState([]);
  const [servo, setServo] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [toggleSensor, setToggleSensor] = useState([]);
  const [toggleServo, setToggleServo] = useState([]);

  const socket = io("http://localhost:8080");

  useEffect(() => {
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

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (toggleSensor == true) {
      socket.emit("toggleSensor", "isOn");
    } else {
      socket.emit("toggleSensor", "isOff");
    }

    return () => {
      socket.disconnect();
    };
  }, [toggleSensor]);

  useEffect(() => {
    if (toggleServo == true) {
      socket.emit("toggleServo", "isOn");
    } else {
      socket.emit("toggleServo", "isOff");
    }

    return () => {
      socket.disconnect();
    };
  }, [toggleServo]);

  const handleToggleClick = () => {
    // Only toggle the state if toggleSensor is false
    if (!toggleSensor) {
      if (toggleServo == false) {
        setToggleServo(true);
      } else {
        setToggleServo(false);
      }
    }
  };

  return (
    <div>
      <h1 className="title pt-5">Control</h1>
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
            <input type="checkbox" id="toggleBtnServo" disabled={toggleSensor} />
            <span className={`Slider switchOnOff ${toggleSensor ? "disabled" : ""}`} onClick={handleToggleClick} style={{ opacity: toggleSensor ? "0.5" : "1" }}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
