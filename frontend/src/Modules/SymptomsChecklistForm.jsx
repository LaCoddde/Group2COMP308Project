import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { gql, useMutation } from "@apollo/client";
import {toast} from 'react-toastify';

export default function SymptomChecklistForm() {
  // Define mutation
  const RECORD_SYMPTOMS = gql`
    mutation RecordSymptoms($patientId: String!, $symptomsList: [String]!) {
      recordSymptoms(patientId: $patientId, symptomsList: $symptomsList) {
        id
        patientId
        symptomsList
      }
    }
  `;
  const [recordSymptomsMutation] = useMutation(RECORD_SYMPTOMS);
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

  // Train the model
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

      // Generate synthetic training data
      const { symptoms, labels } = generateData(1000);
      const xs = tf.tensor2d(symptoms);
      const ys = tf.tensor2d(labels);

      // Train the model
      await model.fit(xs, ys, { epochs: 50 });

      setModel(model);
      setModelReady(true);
    }

    trainModel();
  }, []);

  // Function to generate synthetic training data
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

      // Simulate label based on symptoms
      const conditionIndex = Math.floor(Math.random() * 5); // Random condition index (0 to 4)
      const label = Array(5).fill(0);
      label[conditionIndex] = 1;
      labels.push(label);
    }
    return { symptoms, labels };
  }

  // Function to make predictions
  const predict = () => {
    if (!model) return;
    console.log(symptoms);
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

  // Event handler for checkbox changes
  const handleCheckboxChange = (symptom) => {
    setSymptoms((prevState) => ({
      ...prevState,
      [symptom]: !prevState[symptom],
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    try {
      const { data } = await recordSymptomsMutation({
        variables: { patientId: loginData.id, symptomsList: selectedSymptoms },
      });
      console.log("Symptoms recorded:", data.recordSymptoms);
      toast.success("Symtoms added successfully!");
    } catch (error) {
      console.error("Error recording symptoms:", error);
      toast.error("Some error occurred during adding symptoms!")
    }
    //predict
    predict();
  };

  return (
    <div className="bg white">
      <Header />
      <div
        className="mt-8 px-6 py-0"
        style={{ width: "55%", margin: "20px 100px" }}
      >
        <h2 className="text-2xl font-semibold mb-4">Symptom Checklist</h2>
        <h6>
          Please add all the symptoms you're experiencing here to get an insight
          on your condition.
        </h6>
        <br></br>
        <form onSubmit={handleSubmit}>
          {modelReady ? (
            <div>
              {/* Checkbox inputs for symptoms */}
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
                  Submit
                </button>
                <button
                  type="reset"
                  className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
                <button
                  type="reset"
                  onClick={()=> navigate("/patient-dashboard")}
                  className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Dashboard
                </button>
              </div>

              {prediction && (
                <div className="mt-4">
                  <h2 class="text-2xl font-extrabold dark:text-white">
                    AI Prediction
                  </h2>
                  <p class="my-4 text-md text-gray-500">{`Based upon the provided symptoms the predicted condition is ${prediction}. We advise you to consult a doctor. Be acreful and take care of your health.`}</p>
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
