import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const GET_VITAL_SIGNS_BY_NURSE_ID = gql`
  query GetVitalSignsByNurseId($nurseId: String!) {
    getVitalSignsByNurseId(nurseId: $nurseId) {
      id
      patientId
      createdAt
      bloodPressure
      bodyTemperature
      heartRate
      respiratoryRate
    }
  }
`;

const GET_PATIENT_INFO_BY_ID = gql`
  query GetPatientInfoById($patientId: String!) {
    getPatientInfoById(patientId: $patientId) {
      id
      name
      email
      gender
      roleId
      age
    }
  }
`;

const PatientRow = ({ vitalSign }) => {

  const navigate = useNavigate();

  const {
    loading: patientLoading,
    error: patientError,
    data: patientData,
  } = useQuery(GET_PATIENT_INFO_BY_ID, {
    variables: { patientId: vitalSign.patientId },
  });

 
  const previousVisit = (id) => {
    navigate('/previous-visit/' + id);
  };

  if (patientLoading) return <p>Loading patient data...</p>;
  if (patientError)
    return <p>Error loading patient data: {patientError.message}</p>;

  console.log(vitalSign, patientData.getPatientInfoById.name)
  return (
    <tr key={vitalSign.id}>
      <td className="border px-4 py-2">
        {patientData.getPatientInfoById.name}
      </td>
      <td className="border px-4 py-2">{vitalSign.bodyTemperature}</td>
      <td className="border px-4 py-2">{vitalSign.heartRate}</td>
      <td className="border px-4 py-2">{vitalSign.bloodPressure}</td>
      <td className="border px-4 py-2">{vitalSign.respiratoryRate}</td>
      <td className="border px-4 py-2">
      <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md text-sm" onClick={() => { previousVisit(vitalSign.patientId) }}>Previous Visit</button>

         </td>
    </tr>
  );
};

export default function NurseDashboard() {
  const { loginData } = useContext(AuthContext);
  
  const [vitalSign, setVitalSign] = useState(null);

  const { loading, error, data, refetch } = useQuery(
    GET_VITAL_SIGNS_BY_NURSE_ID,
    {
      variables: { nurseId: loginData.id },
    }
  );

  useEffect(() => {
    refetch();
  }, [loginData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
        <Header />
        <div className="sm:mx-auto sm:w-full sm:max-w-screen-xl">
          <h2 className="mt-10 mb-6 text-center text-3xl font-bold leading-9 text-gray-900">
            Nurse Dashboard
          </h2>
          {/* Alert message box */}
          <div className="absolute inset-x-0 top-12">
            <div className="border-solid rounded-md border-2 border-red-600 text-center p-2 max-w-96 ml-auto mr-auto ">
              <p className="text-center font-bold text-red-600">Alert!</p>
              <p className="text-red-600">Message From Database</p>
            </div>
          </div>
          {data &&
          data.getVitalSignsByNurseId &&
          data.getVitalSignsByNurseId.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Body Temperature (°F)
                    </th>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Heart Rate (bpm)
                    </th>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Blood Pressure (mmHg)
                    </th>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Respiratory Rate (bpm)
                    </th>
                    <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.getVitalSignsByNurseId.map((vitalSign) => (
                    <PatientRow vitalSign={vitalSign} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No vital signs found.</p>
          )}
          <div className="fixed bottom-12 right-4">
            <Link
              to="/record-visit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Record New Visit
            </Link>
          </div>
          <div className="fixed bottom-12 left-4">
            <Link
              to="/motivational-form"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Create Tips
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
