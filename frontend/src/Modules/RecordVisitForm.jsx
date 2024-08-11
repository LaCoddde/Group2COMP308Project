import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
 
export default function RecordVisitForm() {
    const navigate = useNavigate();

    const GET_PATIENTS = gql`
        query {
            patients {
                id
                name
            }
        }
    `;

    
    const { loading, error, data } = useQuery(GET_PATIENTS);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const { loginData } = useContext(AuthContext);

    useEffect(() => {
        if (!loading && !error) {
            setPatients(data.patients);
        }
    }, [loading, error, data]);

    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        const patient = patients.find((p) => p.id === patientId);
        setSelectedPatient(patient);
    };

    const RECORD_VITAL_SIGNS_MUTATION = gql`
        mutation RecordVitalSigns(
            $patientId: ID!,
            $nurseId: String!,
            $bodyTemperature: Float!,
            $respiratoryRate: Float!, 
            $bloodPressure: String!,
            $heartRate: Float! 
        ) {
            recordVitalSigns(
                patientId: $patientId,
                nurseId: $nurseId,
                bodyTemperature: $bodyTemperature,
                respiratoryRate: $respiratoryRate,
                bloodPressure: $bloodPressure,
                heartRate: $heartRate
            ) {
                patientId
                nurseId
                bodyTemperature
                respiratoryRate
                bloodPressure
                heartRate
            }
        }
    `;
    

    const [bodyTemperature, setBodyTemperature] = useState(98.6);
    const [heartRate, setHeartRate] = useState(73);
    const [bloodPressure, setBloodPressure] = useState("120/80");
    const [respiratoryRate, setRespiratoryRate] = useState(17);


    const [recordVitalSigns] = useMutation(RECORD_VITAL_SIGNS_MUTATION);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!selectedPatient) {
                toast.error("Please select a patient");
                return;
            }
    
            if (!loginData || !loginData.id) {
                toast.error("Nurse ID is missing. Please log in again.");
                return;
            }
    
            const { data } = await recordVitalSigns({
                variables: {
                    patientId: selectedPatient.id,
                    nurseId: loginData.id,
                    bodyTemperature: parseFloat(bodyTemperature),
                    respiratoryRate: parseFloat(respiratoryRate),
                    bloodPressure,
                    heartRate: parseFloat(heartRate),
                },
            });
            console.log("Data recorded:", data);
            setBodyTemperature(98.6);
            setHeartRate(73);
            setBloodPressure("120/80");
            setRespiratoryRate(17);
    
            toast.success("Vital signs recorded successfully");
    
            navigate("/nurse-dashboard");
    
        } catch (error) {
            toast.error(`Failed to record vital signs: ${error.message}`);
        }
    };
    

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
            <Header />
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold leading-9 text-gray-900">
                    Record Visit for your Patient
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="patient" className="block text-sm font-medium leading-5 text-gray-700">
                                Select Patient
                            </label>
                            <select
                                id="patient"
                                name="patient"
                                onChange={handlePatientChange}
                                value={selectedPatient ? selectedPatient.id : ""}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    <div>
                        <label htmlFor="bodyTemperature" className="block text-sm font-medium leading-5 text-gray-700">
                            Body Temperature (°F)
                        </label>
                        <input
                            id="bodyTemperature"
                            name="bodyTemperature"
                            type="text"
                            autoComplete="off"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={bodyTemperature}
                            onChange={(e) => setBodyTemperature(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="heartRate" className="block text-sm font-medium leading-5 text-gray-700">
                            Heart Rate (bpm)
                        </label>
                        <input
                            id="heartRate"
                            name="heartRate"
                            type="text"
                            autoComplete="off"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="bloodPressure" className="block text-sm font-medium leading-5 text-gray-700">
                            Blood Pressure (mmHg)
                        </label>
                        <input
                            id="bloodPressure"
                            name="bloodPressure"
                            type="text"
                            autoComplete="off"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={bloodPressure}
                            onChange={(e) => setBloodPressure(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="respiratoryRate" className="block text-sm font-medium leading-5 text-gray-700">
                            Respiratory Rate (bpm)
                        </label>
                        <input
                            id="respiratoryRate"
                            name="respiratoryRate"
                            type="text"
                            autoComplete="off"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={respiratoryRate}
                            onChange={(e) => setRespiratoryRate(e.target.value)}
                        />
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                        >
                            Record
                        </button>
                    </div>
                    </form>
                )}
            </div>
        </div>
    );
}
