import React, { useState } from "react";
import {
  MdFavorite,
  MdWhatshot,
  MdOpacity,
  MdStraighten,
  MdDirectionsWalk,
} from "react-icons/md";
import Header from "./Header";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

export default function DailyInformationForm() {
  const RECORD_DAILY_INFO = gql`
    mutation RecordDailyInfo(
      $patientId: String!
      $pulseRate: Float!
      $bloodPressure: String!
      $weight: Float!
      $temperature: Float!
      $respiratoryRate: Float!
    ) {
      recordDailyInfo(
        patientId: $patientId
        pulseRate: $pulseRate
        bloodPressure: $bloodPressure
        weight: $weight
        temperature: $temperature
        respiratoryRate: $respiratoryRate
      ) {
        id
        patientId
        pulseRate
        bloodPressure
        weight
        temperature
        respiratoryRate
      }
    }
  `;
  const navigate = useNavigate();
  const [pulseRate, setPulseRate] = useState(70);
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [weight, setWeight] = useState(150);
  const [temperature, setTemperature] = useState(98.6);
  const [respiratoryRate, setRespiratoryRate] = useState(18);
  const [recordDailyInfo] = useMutation(RECORD_DAILY_INFO);
  const { loginData } = useContext(AuthContext);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await recordDailyInfo({
        variables: {
          patientId: loginData.id, // Replace with actual patient ID
          pulseRate: parseFloat(pulseRate),
          bloodPressure,
          weight: parseFloat(weight),
          temperature: parseFloat(temperature),
          respiratoryRate: parseFloat(respiratoryRate),
        },
      });
      console.log("Data recorded:", data);
      // Reset form fields after submission
      setPulseRate(70);
      setBloodPressure("120/80");
      setWeight(150);
      setTemperature(98.6);
      setRespiratoryRate(18);
      toast.success("Daily information recorded successfully!");
      //naviagte back to dashboard
      navigate("/patient-dashboard");
    } catch (error) {
      console.error("Error recording daily information:", error);
      toast.error("Some error occurred please try again!");
    }
  };

  return (
    <div className="bg-white">
      <Header />
      <div style={{ width: "40%", margin: "50px auto" }}>
        <h2 className="text-2xl font-semibold mb-4 bg-indigo-600 text-white px-6 py-3 flex items-center justify-between">
          <span>Enter Daily Information</span>
          <MdWhatshot className="text-xl" />
        </h2>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4 flex items-center">
            <MdFavorite className="mr-2 text-indigo-600" />
            <input
              type="number"
              id="pulseRate"
              name="pulseRate"
              value={pulseRate}
              onChange={(e) => setPulseRate(e.target.value)}
              placeholder="Pulse Rate"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <MdOpacity className="mr-2 text-indigo-600" />
            <input
              type="text"
              id="bloodPressure"
              name="bloodPressure"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="Blood Pressure"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <MdStraighten className="mr-2 text-indigo-600" />
            <input
              type="number"
              id="weight"
              name="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <MdWhatshot className="mr-2 text-indigo-600" />
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Temperature"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <MdDirectionsWalk className="mr-2 text-indigo-600" />
            <input
              type="number"
              id="respiratoryRate"
              name="respiratoryRate"
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(e.target.value)}
              placeholder="Respiratory Rate"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
