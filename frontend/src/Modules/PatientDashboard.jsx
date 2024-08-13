import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserEdit,
  FaHeartbeat,
  FaThermometerHalf,
  FaWeight,
  FaLungs,
  FaNotesMedical,
} from "react-icons/fa";
import { MdNotificationAdd } from "react-icons/md";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";

export default function PatientDashboard() {
  const { loginData } = useContext(AuthContext);
  const [lastSymptoms, setLastSymptoms] = useState([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyText, setEmergencyText] = useState("");
  const [emergencySent, setEmergencySent] = useState(false);

  const GET_DAILY_INFO = gql`
    query GetDailyInfoByPatientId($patientId: String!) {
      getDailyInfoByPatientId(patientId: $patientId) {
        patientId
        weight
        bloodPressure
        pulseRate
        temperature
        respiratoryRate
      }
    }
  `;

  const GET_SYMPTOMS_BY_PATIENT_ID = gql`
    query GetSymptomsByPatientId($patientId: String!) {
      getSymptomsByPatientId(patientId: $patientId) {
        id
        patientId
        symptomsList
      }
    }
  `;

  const GET_REPORTS_BY_PATIENT_ID = gql`
    query GetReportsByPatientId($patientId: String!) {
      getReportsByPatientId(patientId: $patientId) {
        id
        report
        createdAt
      }
    }
  `;

  const { loading, data, refetch } = useQuery(GET_DAILY_INFO, {
    variables: { patientId: loginData.id },
  });

  const { data: symptomData, refetch: refetchSymptom } = useQuery(GET_SYMPTOMS_BY_PATIENT_ID, {
    variables: { patientId: loginData.id },
  });

  const { data: reportData, refetch: refetchReports } = useQuery(GET_REPORTS_BY_PATIENT_ID, {
    variables: { patientId: loginData.id },
  });

  useEffect(() => {
    refetch();
    refetchSymptom();
    refetchReports();
  }, [loginData]);

  useEffect(() => {
    if (symptomData && symptomData.getSymptomsByPatientId) {
      const symptoms = symptomData.getSymptomsByPatientId;
      if (symptoms.length > 0) {
        const lastSymptom = symptoms[symptoms.length - 1];
        setLastSymptoms(lastSymptom.symptomsList);
      }
    }
  }, [symptomData]);

  const handleEmergencySubmit = () => {
    setEmergencySent(true);
    setShowEmergency(false);
    setTimeout(() => {
      setEmergencySent(false);
    }, 3000); // Tooltip disappears after 3 seconds
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="mx-auto mt-4 px-6 py-0 rounded-md max-w-7xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Patient Dashboard</h2>

        <div className="flex justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link
              to="/daily-information"
              className="py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Record Daily Info
            </Link>
            <Link
              to="/symptom-checklist"
              className="py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log Symptoms
            </Link>
            <button
              className="py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => setShowEmergency(true)}
            >
              Emergency
            </button>
          </div>
          <Link
            to="/display-motivational-tips"
            className="flex items-center text-green-400"
          >
            <MdNotificationAdd className="text-2xl mr-2" />
            <span className="text-sm text-gray-600">Motivational Tips</span>
          </Link>
        </div>

        {showEmergency && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-medium mb-4">Enter Emergency Details</h2>
              <textarea
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                placeholder="Describe your emergency..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                rows="4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="py-2 px-4 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                  onClick={() => setShowEmergency(false)}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleEmergencySubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {emergencySent && (
          <div className="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded-lg shadow-lg">
            Emergency sent to first responders
          </div>
        )}

        <div className="flex flex-wrap">
          {/* Main content */}
          <div className="flex-1 mr-6">
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium text-blue-600">
                  Patient Details <FaUserEdit />
                </h3>
              </div>
              {loginData && (
                <div className="grid grid-cols-2 gap-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p>{loginData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age:</p>
                    <p>{loginData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p>{loginData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender:</p>
                    <p>{loginData.gender}</p>
                  </div>
                </div>
              )}
            </div>

            {loading && <p>Fetching Daily Info...</p>}
            {data && data.getDailyInfoByPatientId.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Daily Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaHeartbeat className="mr-2" /> Pulse Rate: {data.getDailyInfoByPatientId[0].pulseRate}
                  </div>
                  <div className="flex items-center">
                    <FaThermometerHalf className="mr-2" /> Blood Pressure: {data.getDailyInfoByPatientId[0].bloodPressure}
                  </div>
                  <div className="flex items-center">
                    <FaWeight className="mr-2" /> Weight: {data.getDailyInfoByPatientId[0].weight}
                  </div>
                  <div className="flex items-center">
                    <FaThermometerHalf className="mr-2" /> Temperature: {data.getDailyInfoByPatientId[0].temperature}
                  </div>
                  <div className="flex items-center">
                    <FaLungs className="mr-2" /> Respiratory Rate: {data.getDailyInfoByPatientId[0].respiratoryRate}
                  </div>
                </div>
              </div>
            )}

            {lastSymptoms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  Last Recorded Symptoms <FaNotesMedical className="ml-2" />
                </h3>
                <ul className="list-disc pl-5">
                  {lastSymptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full sm:w-1/3 lg:w-1/4">
            <div className="mb-6">
              {reportData && reportData.getReportsByPatientId.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Doc Report</h3>
                  <ul className="list-disc pl-5">
                    {reportData.getReportsByPatientId.map((report) => (
                      <li key={report.id}>
                        {report.createdAt && !isNaN(new Date(report.createdAt)) ? (
                          <>
                            {new Date(report.createdAt).toLocaleString()} - {report.report}
                          </>
                        ) : (
                          <>Recent - {report.report}</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
