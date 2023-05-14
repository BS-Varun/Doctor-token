import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:3000";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await axios.get(`${ENDPOINT}/api/patients`);
      setPatients(res.data);
      setCurrentToken(res.data[0].token);
    };

    fetchPatients();

    const socket = io(ENDPOINT);
    socket.on("tokenChange", (newToken) => {
      setCurrentToken(newToken);
      setActiveIndex(activeIndex + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddPatient = async () => {
    const res = await axios.post(`${ENDPOINT}/api/patients/add`, {
      name,
      phone,
    });
    setPatients([...patients, res.data]);
    setName("");
    setPhone("");
  };

  const handleNextToken = async () => {
    const res = await axios.post(`${ENDPOINT}/api/token/next`);
    setCurrentToken(res.data);
    setActiveIndex(activeIndex + 1);
  };

  return (
    <div>
      <h1>Token Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleAddPatient}>Add Patient</button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id} className={index === activeIndex ? "active" : ""}>
              <td>{patient.name}</td>
              <td>{patient.token}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2></h2>
        <h1></h1>
        <button onClick={handleNextToken}></button>
      </div>
    </div>
  );
};

export default Dashboard;

