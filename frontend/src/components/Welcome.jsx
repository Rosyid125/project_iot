import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const [sensor, setSensor] = useState([]);
  const [servo, setServo] = useState([]);
  const [nilai, setNilai] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/mqtt");
        setSensor(response.data.sensorData);
        setServo(response.data.servoData);
        setNilai(response.data.nilaiSensorData);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
        }
      }
    };
    getData();
  }, []);

  return (
    <div>
      <h1 className="title pt-5">Control</h1>
      <h2 className="subtitle ">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
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
    </div>
  );
};

export default Welcome;
