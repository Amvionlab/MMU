// Setup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language"; 
import CategoryIcon from "@mui/icons-material/Category"; // Asset Type icon
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import PersonIcon from "@mui/icons-material/Person"; 
import MapIcon from "@mui/icons-material/Map"; // Icon for territories and states
import StoreIcon from "@mui/icons-material/Store"; // Office Zones

function Setup() {
  const navigate = useNavigate();

  const topics = {
    ACCESS: [
      { 
          title: "User Accounts", 
          sub: "Manage Software Users", 
          icon: <PersonIcon />, 
          path: "/setup/user-accounts" 
      },
  ],
   
    "EMPLOYEES ": [
        
        { 
            title: "Employee Directory", 
            sub: "Staff Information", 
            icon: <PeopleAltIcon />, 
            path: "/setup/employee" 
        },
    ],
   
  };

  
  return (
    <div className="w-full h-full bg-second p-1 font-sui text-sm">
      <div className="h-full bg-box p-2">
      {Object.keys(topics).map((topic, index) => (
        <div key={topic} className="border-2 border-second rounded-lg bg-box p-4 mb-2">
          <h2 className="text-base font-bold text-prime mb-1">{topic}</h2>
          <div className="h-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
            {topics[topic].map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer flex flex-row p-4 gap-4 items-center bg-box border rounded-xl transition-transform hover:shadow "
                onClick={() => navigate(item.path)} 
              >
                <span
  className={`text-flo text-2xl transition-transform transform group-hover:translate-x-1  group-hover:scale-125`}
>
  {item.icon}
</span>

                <div className="flex flex-col transition-transform transform  group-hover:font-medium">
                  <span className="font-bold text-flo text-md group-hover:text-flo">{item.title}</span>
                  <span className="text-gray-500 text-xs">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
      </div>
  );
}

export default Setup;
