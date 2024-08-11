import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
 
export default function MotivationalTipsForm() {
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

    const CREATE_MOTIVATIONAL_TIPS = gql`
        mutation createMotivationalTips(
            $patientId: ID!,
            $nurseId: String!,
            $motivationalTips: String!,
        ) {
            createMotivationalTips(
                patientId: $patientId,
                nurseId: $nurseId,
                motivationalTips: $motivationalTips,

            ) {
                patientId
                nurseId
                motivationalTips
            }
        }
    `;
    


    const [motivationalTips, setMotivationalTips] = useState("");
    const [createMotivationalTips] = useMutation(CREATE_MOTIVATIONAL_TIPS);


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
    
            const { data } = await createMotivationalTips({
                variables: {
                    patientId: selectedPatient.id,
                    nurseId: loginData.id,
                    motivationalTips,
                },
            });
            console.log("Data recorded:", data);

            setMotivationalTips("");
    
            toast.success("Motivational Tips Created successfully");
    
            navigate("/nurse-dashboard");
    
        } catch (error) {
            toast.error(`Failed Motivational Tips to create: ${error.message}`);
        }
    };
    

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
            <Header />
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold leading-9 text-gray-900">
                    Create Motivational Tips for your Patient
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
                        <label htmlFor="bloodPressure" className="block text-sm font-medium leading-5 text-gray-700">
                            Motivational Tips
                        </label>
                        <textarea
                            id="motivationalTips"
                            name="motivationalTips"
                            type="text"
                            autoComplete="off"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={motivationalTips}
                            onChange={(e) => setMotivationalTips(e.target.value)}
                        />
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                        >
                           Create
                        </button>
                    </div>
                    </form>
                )}
            </div>
        </div>
    );
}
