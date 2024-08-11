import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";

export default function DisplayMotivationalTips() {
  const { loginData } = useContext(AuthContext);
  const GET_MOTIVATIONAL_TIPS = gql`
    query GetMotivationalTips($patientId: String!) {
      getMotivationalTips(patientId: $patientId) {
        nurseId
        patientId
        motivationalTips
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_MOTIVATIONAL_TIPS, {
    variables: { patientId: loginData.id },
  });

  useEffect(() => {
    refetch();
  }, [loginData, refetch]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch motivational tips.");
    }
  }, [error]);

  return (
    <div className="bg-white">
      <Header />
      <div className="mx-auto mt-4 px-6 py-0 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Motivational Message
        </h2>

        {loading && <p>Fetching Messages</p>}
        {data &&
          data.getMotivationalTips &&
          data.getMotivationalTips.length !== 0 && (
            <div className="mb-6">
              <div className="flex flex-col justify-between">
                {data.getMotivationalTips.map((tip, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <SiGooglemessages /> message: {tip.motivationalTips}
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
