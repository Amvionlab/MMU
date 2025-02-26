import React from "react";
import { Link } from "react-router-dom";
import { RiDashboardHorizontalLine } from "react-icons/ri";

function Dashboard() {
  const data = [
    {
      title: "MMU - 1",
      id: 1,
      unit: "Medical Unit 1",
      location: "Kanniyakumari",
    },
    {
      title: "MMU - 2",
      id: 2,
      unit: "Medical Unit 2",
      location: "Krishnagiri",
    },
    {
      title: "MMU - 3",
      id: 3,
      unit: "Medical Unit 3",
      doctorName: "Dr. Jones",
      location: "Nilgiris",
      
    },
    {
      title: "MMU - 4",
      id: 4,
      unit: "Medical Unit 4",
      doctorName: "Dr. Wilson",
      location: "Tenkasi",
     
    },
    {
      title: "MMU - 5",
      id: 5,
      unit: "Medical Unit 5",
      doctorName: "Dr. Williams",
      location: "Tirunelveli",
    },
    {
      title: "MMU - 6",
      id: 6,
      unit: "Medical Unit 6",
      doctorName: "Dr. Brown",
      location: "Tuticorin",
    },
    {
      title: "MMU - 7",
      id: 7,
      unit: "Medical Unit 7",
      doctorName: "Dr. Davis",
      location: "Virudhunagar",

    },
  ];

  return (
    <main className="bg-second font-poppins p-0.5 gap-0.5 h-full">
      <div className="bg-box p-2 mb-0.5 h-[12%]">
      <h2 className="flex text-prime gap-4 items-center text-xl font-bold mt-4">
        <RiDashboardHorizontalLine />
        MMU Dashboard
      </h2>
      </div>
      <div className="h-[88%] w-full p-6 bg-white grid grid-cols-2 gap-y-6 gap-x-8">
       {data.map((val, i) => (
  <div
    key={i}
    className="bg-red-100 hover:bg-red-200 p-4 flex items-center justify-between rounded-full shadow-sm hover:shadow-md"
  >
    <div className="flex items-center h-fit gap-5">
      <p className="text-sm font-bold ">{val.title}</p>
      <p className="self-stretch w-[2px] bg-gray-700"></p>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold ">{val.unit}</p>
       
        <p className="text-sm font-normal font-raleway">{val.location}</p>
      </div>
    </div>

    <div className="flex flex-col items-center justify-center gap-2">
      <Link to={`/dashboard/mmu/${i + 1}`}>
        <p className="p-2 text-xs bg-red-600 hover:bg-box font-bold shadow-sm hover:shadow hover:text-prime text-box cursor-pointer rounded-full">
          View
        </p>
      </Link>
    </div>
  </div>
))}
      </div>
    </main>
  );
}

export default Dashboard;
