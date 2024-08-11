import React, { useContext } from "react";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import Header from "./Header";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function PreviousVisitsPage(props) {
  const { loginData } = useContext(AuthContext);
  let { id } = useParams();
  console.log("Testing Id " + id);

  const navigate = useNavigate();

  const GET_PATIENT_INFO = gql`
    query getPatientInfoById($id: String!) {
      getPatientInfoById(patientId: $id) {
        id
        name
        email
        gender
        roleId
        age
      }
    }
  `;

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

  const {
    loading: loadingData,
    error: errorData,
    data: dataData,
    refetch: refetchData,
  } = useQuery(GET_VITAL_SIGNS_BY_NURSE_ID, {
    variables: { nurseId: loginData.id, patientId: id },
  });

  const { loading, error, data } = useQuery(GET_PATIENT_INFO, {
    variables: { id: id },
  });

  useEffect(() => {
    refetchData();
  }, [id]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const patientInfo = data.getPatientInfoById;

  const vitalSigns = dataData.getVitalSignsByNurseId;

  return (
    <div className="container mx-auto px-4 py-3">
      <Header />
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Previous Visits
      </h1>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium text-blue-600">Patient Details</h3>
      </div>
      <div>
        {patientInfo && (
          <div className="grid grid-cols-8 gap-y-2">
            <div>
              <p className="text-sm text-gray-600">Name:</p>
              <p>{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age:</p>
              <p>{patientInfo.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p>{patientInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender:</p>
              <p>{patientInfo.gender}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-medium text-blue-600">Vital Signs</h3>
        <table className="table-auto w-full mt-4 border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200 bg-gray-100">
                Date
              </th>
              <th className="px-4 py-2 border border-gray-200 bg-gray-100">
                Blood Pressure
              </th>
              <th className="px-4 py-2 border border-gray-200 bg-gray-100">
                Body Temperature
              </th>
              <th className="px-4 py-2 border border-gray-200 bg-gray-100">
                Heart Rate
              </th>
              <th className="px-4 py-2 border border-gray-200 bg-gray-100">
                Respiratory Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {vitalSigns?.map((sign) => (
              <tr key={sign.id}>
                <td className="px-4 py-2 border border-gray-200">
                  {sign.createdAt
                    ? new Date(Number(sign.createdAt)).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {sign.bloodPressure}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {sign.bodyTemperature}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {sign.heartRate}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {sign.respiratoryRate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          type="reset"
          onClick={() => navigate("/nurse-dashboard")}
          className="w-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
