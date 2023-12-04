import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../assets/control.css";

const Welcome = () => {
  const [sensor, setSensor] = useState([]);
  const [servo, setServo] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [toggleSensor, setToggleSensor] = useState(null); //set null untuk handle mount component supaya tidak mengirim topic ke mikrokontroller
  const [toggleServo, setToggleServo] = useState(null); //sama kek yang diatas

  const socket = io("http://localhost:8080");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to the received data");
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
  }, [socket]);

  console.log(servo);
  console.log(sensor);
  console.log(nilai);

  useEffect(() => {
    if (toggleSensor == true) {
      socket.emit("toggleSensor", "sensorIsOn");
    } else if (toggleSensor == false) {
      socket.emit("toggleSensor", "sensorIsOff");
    } else {
      console.log("nothing to emit on toggleSensor, it's still null, try to push the switch again");
    }
  }, [toggleSensor]);

  useEffect(() => {
    if (toggleServo == true) {
      socket.emit("toggleServo", "servoIsOn");
    } else if (toggleServo == false) {
      socket.emit("toggleServo", "servoIsOff");
    } else {
      console.log("nothing to emit on toggleServo, it's still null, try to push the switch again");
    }
  }, [toggleServo]);

  const handleToggleClick = () => {
    // Only toggle the state if toggleSensor is false
    if (!toggleSensor) {
      if (toggleServo == false || toggleServo == null) {
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
            <h3 className="title is-5">Status Servo</h3>
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
                if (toggleSensor == false || toggleSensor == null) {
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
