import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";

export default function DocReport() {
  const { loginData } = useContext(AuthContext);

  const GET_REPORTS = gql`
    query GetReportsByPatientId($patientId: String!) {
      getReportsByPatientId(patientId: $patientId) {
        nurseId
        patientId
        report
        createdAt
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_REPORTS, {
    variables: { patientId: loginData.id },
  });

  useEffect(() => {
    console.log("Refetching data...");
    refetch();
  }, [loginData, refetch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports.");
    }
  }, [error]);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="mx-auto mt-4 px-6 py-0 rounded-md max-w-7xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Medical Reports
        </h2>

        {loading && <p>Fetching Reports...</p>}
        {error && <p>Error loading reports. Please try again later.</p>}
        {!loading && !error && (!data || data.getReportsByPatientId.length === 0) && (
          <p>No reports found.</p>
        )}
        {data && data.getReportsByPatientId && data.getReportsByPatientId.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-col justify-between">
              {data.getReportsByPatientId.map((report, index) => (
                <div key={index} className="flex items-center mb-2">
                  <SiGooglemessages />{" "}
                  {new Date(report.createdAt).toLocaleString()} - {report.report}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          <Link
            to="/patient-dashboard"
            className="py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </Link>
        </div>
        <br />
      </div>
    </div>
  );
}
