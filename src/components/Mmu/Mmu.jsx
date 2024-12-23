import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { FaFingerprint } from "react-icons/fa";
import { MdOutlineGpsFixed, MdNoteAlt } from "react-icons/md";
import QRCode from "react-qr-code"; // Importing QRCode from react-qr-code

function MMU() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [url, payload]);

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
          <div onClick={() => setIsModalOpen(true)} className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
            <div className="text-center">
              <BiCctv size={100} />
              <h2 className="font-semibold mt-4">IP Surveillance</h2>
            </div>
          </div>
          <Link to={`/dashboard/mmu/biometric/${mmu}`} className="block h-80">
            <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
              <div className="text-center">
                <FaFingerprint size={80} />
                <h2 className="font-semibold mt-4">Bio - Metric</h2>
              </div>
            </div>
          </Link>
          <Link to={`/dashboard/mmu/map/${mmu}`} className="block h-80">
            <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
              <div className="text-center">
                <MdOutlineGpsFixed size={80} />
                <h2 className="font-semibold mt-4">GPS</h2>
              </div>
            </div>
          </Link>
          <Link to={`/dashboard/mmu/eprescribe/${mmu}`} className="block h-80">
            <div className="bg-red-100 flex justify-center items-center rounded-md shadow-md hover:bg-red-200 hover:shadow-xl h-full">
              <div className="text-center">
                <MdNoteAlt size={80} />
                <h2 className="font-semibold mt-4">E-Prescribing</h2>
              </div>
            </div>
          </Link>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white px-8 py-2 rounded-lg shadow-lg h-[40%] ">
                <button className="text-white bg-red-500 rounded-full h-6 w-6 font-semibold hover:font-bold mb-4" onClick={() => setIsModalOpen(false)}>
                  X
                </button>
                <QRCode
                  value="https://play.google.com/store/apps/details?id=com.mm.android.DMSS"
                  size={128}
                />
                <p className="mt-4 text-center">Scan to get the app</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default MMU;