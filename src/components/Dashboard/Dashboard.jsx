import React from "react";
import { Link } from "react-router-dom";
import { RiDashboardHorizontalLine } from "react-icons/ri";

function Dashboard() {
  const data = [
    {
      title: "MU1",
      id: 1,
      unit: "Medical Unit1",
      doctorName: "Dr. Smith",
      location: "Chennai",
    },
    {
      title: "MU2",
      id: 2,
      unit: "Medical Unit2",
      doctorName: "Dr. Johnson",
      location: "Bangalore",
    },
    {
      title: "MU3",
      id: 3,
      unit: "Medical Unit3",
      doctorName: "Dr. Williams",
      location: "Mumbai",
    },
    {
      title: "MU4",
      id: 4,
      unit: "Medical Unit4",
      doctorName: "Dr. Brown",
      location: "Hyderabad",
    },
    {
      title: "MU5",
      id: 5,
      unit: "Medical Unit5",
      doctorName: "Dr. Jones",
      location: "Delhi",
    },
    {
      title: "MU6",
      id: 6,
      unit: "Medical Unit6",
      doctorName: "Dr. Davis",
      location: "Kolkata",
    },
    {
      title: "MU7",
      id: 7,
      unit: "Medical Unit7",
      doctorName: "Dr. Wilson",
      location: "Pune",
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
    className="bg-red-100 hover:bg-red-200 p-5 flex items-center justify-between rounded-full shadow-sm hover:shadow-md"
  >
    <div className="flex items-center h-fit gap-5">
      <p className="text-sm font-bold">{val.title}</p>
      <p className="self-stretch w-[2px] bg-gray-700"></p>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{val.unit}</p>
        <p className="text-sm font-normal">{val.doctorName}</p>
        <p className="text-sm font-normal">{val.location}</p>
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
