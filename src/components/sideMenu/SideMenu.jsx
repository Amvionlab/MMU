import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faForward,
  faTachometerAlt,
  faWrench,
  faKey,
 
  faSignOutAlt,
 
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../image/redcrossicon.png";
import sampatName from "../../image/redcrosslogo.jpg";
import { UserContext } from "../UserContext/UserContext";

import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from '@mui/system';

const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const { user } = useContext(UserContext);
  const handleIconClick = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  const PurpleTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'purple',
      color: 'white',
      fontSize: '0.875rem',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: 'purple',
    },
  });
  const handleSettingsClick = () => {
    navigate("/password-change");
  };

  const menuItems = [
    { title: "Dashboard", icon: faTachometerAlt, to: "/dashboard", key: "dashboard" },
    { title: "Setup Wizard", icon: faWrench, to: "/setup", key: "setup" },
    { title: "Change Password", icon: faKey, to: "/password-change", key: "setup" },
  ];

  const handleMouseEnter = (title) => {
    setHoveredItem(title);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className={`transition-all duration-500 ${isExpanded ? "sb-expanded" : ""}`}>
      <aside
        className="relative inset-y-0 z-50 h-full text-sui left-0 py-4 px-2 bg-prime transition-all duration-500 ease-in-out"
        style={{ width: isExpanded ? "11rem" : "4.5rem" }}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full gap-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center transition-none whitespace-nowrap gap-2 p-2 mb-4 bg-box hover:text-prime text-white text-lg rounded-full"
              >
                {isExpanded ? (
                  <img
                    src={sampatName}
                    alt="Sampat Name"
                    style={{ minWidth: "120px", height: "37px", justifyItems: "center"}}
                  />
                ) : (
                  <img
                    src={logo}
                    width="40px"
                    height="50px"
                    alt="Logo"
                    style={{ minWidth: "40px", minHeight: "37px" }}
                  />
                )}
              </Link>
            </li>

            {menuItems.map(({ title, icon, to, key }) => (
              user &&
              user[key] === "1" && (
                <li key={title}>
                  <Link
                    to={to}
                    onMouseEnter={() => handleMouseEnter(title)}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center whitespace-nowrap gap-2 p-3 m-1 rounded-lg transition-all duration-500 ease-in-out 
                    ${location.pathname === to ? "bg-white text-prime" : "hover:bg-white hover:text-prime text-white"}`}
                  >
                    <FontAwesomeIcon
                      className="text-md"
                      icon={icon}
                      style={{ minWidth: "24px", textAlign: "center" }} // Fixed width for icon
                    />
                    {isExpanded && (
                      <p className=" text-xs font-medium transition-all duration-500 ease-in-out" style={{ minWidth: "100px" }}>
                        {title}
                      </p>
                    )}
                    {!isExpanded && hoveredItem === title && (
                      <p className="absolute z-50 left-20 px-2 py-1 rounded text-sm  bg-flo text-white transition-opacity text-center align-center justify-center">
                        {title}
                      </p>
                    )}
                  </Link>
                </li>
              )))}

            <li>
              {isExpanded ? (
                // Render only the Link without tooltip when expanded
                <Link
                  to="#"
                  className="flex items-center gap-2 p-3 m-1 mt-32 text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500"
                  onClick={() => setIsExpanded(prev => !prev)}
                >
                  <FontAwesomeIcon
                    className="transition-all duration-300"
                    icon={faForward}
                    style={{
                      minWidth: "24px",
                      textAlign: "center",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />

                  <p className="text-xs font-medium transition-opacity">
                    Collapse
                  </p>
                </Link>
              ) : (
                // Render the Link with tooltip when not expanded
                <PurpleTooltip
                  title="Collapse"
                  placement="right"
                >
                  <Link
                    to="#"
                    className="flex items-center gap-2 p-3 m-1 mt-32 whitespace-nowrap text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500"
                    onClick={() => setIsExpanded(prev => !prev)}
                  >
                    <FontAwesomeIcon
                      className="transition-all duration-300"
                      icon={faForward}
                      style={{
                        minWidth: "24px",
                        textAlign: "center",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </Link>
                </PurpleTooltip>
              )}
            </li>

            <li>
              {isExpanded ? (
                // Render the div without tooltip when expanded
                <div
                  className="flex items-center cursor-pointer gap-2 p-3 m-1 whitespace-nowrap text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500"
                  onClick={handleIconClick}
                >
                  <FontAwesomeIcon
                    className="text-md"
                    icon={faSignOutAlt}
                    style={{ minWidth: "24px", textAlign: "center" }} // Fixed width for icon
                  />
                  <p className="text-xs font-medium transition-opacity">
                    Log out
                  </p>
                </div>
              ) : (
                // Render the div with tooltip when not expanded
                <PurpleTooltip
                  title="Log out"
                  placement="right"
                >
                  <div
                    className="flex items-center cursor-pointer gap-2 p-3 m-1 text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500"
                    onClick={handleIconClick}
                  >
                    <FontAwesomeIcon
                      className="text-md"
                      icon={faSignOutAlt}
                      style={{ minWidth: "24px", textAlign: "center" }} // Fixed width for icon
                    />
                  </div>
                </PurpleTooltip>
              )}
            </li>

          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
