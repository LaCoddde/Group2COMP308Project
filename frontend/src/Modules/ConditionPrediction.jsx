import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { toast } from 'react-toastify';

export default function ConditionPrediction() {
  const location = useLocation();
  const { patientName, patientId } = location.state || {};
  
  const RECORD_SYMPTOMS = gql`
    mutation RecordSymptoms($patientId: String!, $symptomsList: [String]!) {
      recordSymptoms(patientId: $patientId, symptomsList: $symptomsList) {
        id
        patientId
        symptomsList
      }
    }
  `;

  const SEND_REPORT = gql`
    mutation sendReport($patientId: ID!, $nurseId: String!, $report: String!) {
      sendReport(patientId: $patientId, nurseId: $nurseId, report: $report) {
        patientId
        nurseId
        report
      }
    }
  `;

  const [recordSymptomsMutation] = useMutation(RECORD_SYMPTOMS);
  const [sendReportMutation] = useMutation(SEND_REPORT);
  const [model, setModel] = useState(null);
  const { loginData } = useContext(AuthContext);
  const [prediction, setPrediction] = useState("");
  const [symptoms, setSymptoms] = useState({
    feverChills: false,
    cough: false,
    breathingDifficulty: false,
    fatigue: false,
    bodyAches: false,
    headache: false,
    tasteSmellLoss: false,
    soreThroat: false,
    congestionRunnyNose: false,
    nauseaVomiting: false,
    diarrhea: false,
  });
  const [modelReady, setModelReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function trainModel() {
      const model = tf.sequential();
      model.add(
        tf.layers.dense({ inputShape: [11], units: 8, activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 4, activation: "relu" }));
      model.add(tf.layers.dense({ units: 5, activation: "softmax" }));
      model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      const { symptoms, labels } = generateData(1000);
      const xs = tf.tensor2d(symptoms);
      const ys = tf.tensor2d(labels);

      await model.fit(xs, ys, { epochs: 50 });

      setModel(model);
      setModelReady(true);
    }

    trainModel();
  }, []);

  function generateData(numSamples) {
    const symptoms = [];
    const labels = [];
    for (let i = 0; i < numSamples; i++) {
      const symptomVector = [
        Math.round(Math.random()), // Fever or Chills
        Math.round(Math.random()), // Cough
        Math.round(Math.random()), // Shortness of breath or Difficulty breathing
        Math.round(Math.random()), // Fatigue
        Math.round(Math.random()), // Muscle or Body Aches
        Math.round(Math.random()), // Headache
        Math.round(Math.random()), // New loss of taste or smell
        Math.round(Math.random()), // Sore throat
        Math.round(Math.random()), // Congestion or Runny nose
        Math.round(Math.random()), // Nausea or Vomiting
        Math.round(Math.random()), // Diarrhea
      ];
      symptoms.push(symptomVector);

      const conditionIndex = Math.floor(Math.random() * 5); // Random condition index (0 to 4)
      const label = Array(5).fill(0);
      label[conditionIndex] = 1;
      labels.push(label);
    }
    return { symptoms, labels };
  }

  const predict = () => {
    if (!model) return;
    const symptomValues = Object.values(symptoms).map((value) =>
      value ? 1 : 0
    );
    const inputTensor = tf.tensor2d([symptomValues]);
    const prediction = model.predict(inputTensor);
    const conditionIndex = prediction.argMax(1).dataSync()[0];
    const conditions = [
      "Common Cold",
      "Flu",
      "Pneumonia",
      "Food Poisoning",
      "Allergies",
    ];
    const predictedCondition = conditions[conditionIndex];
    setPrediction(predictedCondition);
  };

  const handleCheckboxChange = (symptom) => {
    setSymptoms((prevState) => ({
      ...prevState,
      [symptom]: !prevState[symptom],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    try {
      const { data } = await recordSymptomsMutation({
        variables: { patientId: patientId || loginData.id, symptomsList: selectedSymptoms },
      });
      toast.success("Symptoms added successfully!");
    } catch (error) {
      console.error("Error recording symptoms:", error);
      toast.error("Some error occurred during adding symptoms!");
    }

    predict();
  };

  const handleSendReport = async () => {
    if (!prediction) {
      toast.error("No prediction available to send.");
      return;
    }

    try {
      const { data } = await sendReportMutation({
        variables: {
          patientId: patientId,
          nurseId: loginData.id,
          report: `The predicted condition based on the symptoms is: ${prediction}.`,
        },
      });
      toast.success("Report sent to the patient successfully!");
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error("Failed to send report to the patient.");
    }
  };

  return (
    <div className="bg white">
      <Header />
      <div
        className="mt-8 px-6 py-0"
        style={{ width: "55%", margin: "20px 100px" }}
      >
        <h2 className="text-2xl font-semibold mb-4">AI Medical Prediction</h2>
        {patientName && (
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            Patient: {patientName}
          </h3>
        )}
        <h6>
          Select all reported symptoms by your patient and get an insight into
          their condition
        </h6>
        <br></br>
        <form onSubmit={handleSubmit}>
          {modelReady ? (
            <div>
              {Object.entries(symptoms).map(([symptom, checked]) => (
                <div key={symptom}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange(symptom)}
                    />
                    &nbsp;{symptom.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Predict Condition
                </button>
                <button
                  type="reset"
                  className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/previous-visit/" + patientId)}
                  className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Patient Data
                </button>
              </div>

              {prediction && (
                <div className="mt-4">
                  <h2 className="text-2xl font-extrabold dark:text-white">
                    AI Prediction
                  </h2>
                  <p className="my-4 text-md text-gray-500">{`Based on the provided symptoms, the predicted condition is ${prediction}. We advise you to consult a doctor. Please take care of your health.`}</p>
                  <button
                    type="button"
                    onClick={handleSendReport}
                    className="w-full bg-green-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Send Report to {patientName}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading AI model...</p>
          )}
        </form>
      </div>
    </div>
  );
}
