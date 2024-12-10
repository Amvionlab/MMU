import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { FaFingerprint } from "react-icons/fa6";
import { MdOutlineGpsFixed, MdNoteAlt } from "react-icons/md";

function MMU() {
  const { mmu } = useParams(); 
  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/SalesProductwiseList";

  const payload = {
      FromDate: "2024-12-01T18:30:00Z",
      ToDate: "2024-12-02T18:29:59Z",
      TenantId: "6bced242-032d-47d6-e7cb-08d8f2bf3f35",
      BranchId: "82b28344-d04e-41a0-6465-08d8f2bf3fc3"
  };

  useEffect(() => {
    fetch(url, {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/json', // Specify JSON content
        },
        body: JSON.stringify(payload) // Convert payload to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        console.log(data); // Log the API response data
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error); // Log any errors
    });
  }, [url, payload]); // Dependencies to ensure fetch occurs when these change

  return (
    <main className="p-0.5 bg-second h-full">
      <div className="bg-box p-2 mb-0.5 h-[12%]">
        <h2 className="flex text-prime gap-4 items-center text-xl font-bold mt-4">
          <MdSpaceDashboard size={24} />
          MMU-{mmu} Dashboard
        </h2>
      </div>

      <div className="h-[88%] bg-box p-4 flex justify-center items-center">
        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
            <div className="text-center">
              <BiCctv size={100} />
              <h2 className="font-semibold mt-4">IP Surveillance</h2>
            </div>
          </div>
          <Link to="/dashboard/mmudashboard" className="block h-80">
            <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
              <div className="text-center">
                <FaFingerprint size={80} />
                <h2 className="font-semibold mt-4">Bio - Metric</h2>
              </div>
            </div>
          </Link>
          <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
            <div className="text-center">
              <MdOutlineGpsFixed size={80} />
              <h2 className="font-semibold mt-4">GPS</h2>
            </div>
          </div>
          <Link to="/eprescribe/eprescribe" className="block h-80">
            <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
              <div className="text-center">
                <MdNoteAlt size={80} />
                <h2 className="font-semibold mt-4">E-Prescribing</h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default MMU;