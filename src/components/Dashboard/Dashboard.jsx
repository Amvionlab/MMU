import React from "react";

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
    <div className="h-fit w-full px-10 pt-20  font-poppins grid grid-cols-2 gap-3">
      {data.map((val, i) => (
        <div key={i} className="bg-red-100 p-4 flex justify-between">
          {/* Left Section */}
          <div className="flex h-fit items-start gap-2">
            <p className="text-xs font-bold">{val.title}</p>
            <p className="self-stretch w-[2px] bg-gray-700"></p>
            <div className="flex flex-col gap-1">
              <p className="text-xs">{val.unit}</p>
              <p className="text-xs">{val.doctorName}</p>
              <p className="text-xs">{val.location}</p>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col gap-2 items-center">
            <p className="p-1 text-xs bg-white text-gray-900 rounded-3xl cursor-pointer">
              To be viewed
            </p>
            <p className="p-1 text-xs bg-red-700 text-white cursor-pointer">
              View Details
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
