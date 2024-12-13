import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

import User from "./components/Admin/User";
import Location from "./components/Admin/Location";
import Territory from "./components/Admin/Territory";
import State from "./components/Admin/State";
import Division from "./components/Admin/Division";
import Product from "./components/Admin/Product";
import Aop from "./components/Admin/Aop";
import Access from "./components/Admin/Access";
import Employee from "./components/Admin/Employee";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Mmu from "./components/Mmu/Mmu";
import Map from "./components/Map/Map";
import ChangePass from "./components/Login/Change_pass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../src/components/UserContext/UserContext";
import { TicketProvider } from "../src/components/UserContext/TicketContext";
import SideMenu from "./components/sideMenu/SideMenu";
import Setup from "./components/Setup/Setup";
import MmuDashboard from "./components/Mmu/MMUDashBoard/MmuDashboard";
import EPrescibeSoftware from "./components/EPrescribe/EPrescibeSoftware";


const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

function App() {
  const { user, setUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [open, setOpen] = useState(false);
  const timeoutIdRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
      resetTimeout();

      const events = [
        "mousemove",
        "mousedown",
        "keypress",
        "scroll",
        "touchstart",
      ];
      const resetUserTimeout = () => resetTimeout();

      events.forEach((event) =>
        window.addEventListener(event, resetUserTimeout)
      );

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, resetUserTimeout)
        );
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
      };
    } else {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, resetTimeout, setUser]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success("Logged in successfully!");
  };

  return (
    <Router>
      <div className="App bg-second font-sui">
        <ToastContainer />
        {isAuthenticated ? (
          <>
            <div className="main-content flex overflow-y-hidden">
              <SideMenu />
              <div className="flex-1 md:overflow-y-auto h-screen">
                <TicketProvider>
                  <Routes>
                    <Route path="/password-change" element={<ChangePass />} />

                    {user && user.setup === "1" && (
                      <>
                        <Route path="*" element={<Navigate to="/setup" />} />
                        
                      </>
                    )}
                    {user && user.setup === "0" && (
                      <>
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                       
                      </>
                    )}

{user && user.setup === "1" && (
                   
                      <>
                      <Route
                          path="/dashboard/mmu/map"
                          element={<Map />}
                        />
                          <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/dashboard/mmu/:mmu"
                          element={<Mmu />}
                        />
                        <Route
                          path="/dashboard/mmu/biometric"
                          element={<MmuDashboard />}
                        />
                        <Route
                          path="/dashboard/mmu/eprescribe"
                          element={<EPrescibeSoftware />}
                        />
                       
                   
                        {/* <Route
                          path="/inventory/:group/:type"
                          element={<TypeTable />}
                        /> */}
                       
                      </>
                    )}

                    {user && user.setup === "1" && (
                      <>
                        <Route path="/setup/user" element={<User />} />
                        
                        <Route path="/setup/access" element={<Access />} />
                        <Route path="/setup" element={<Setup />} />
                        <Route path="/Setup/zones" element={<Location />} />
                        <Route path="/Setup/territories" element={<Territory />} />
                        <Route path="/Setup/states" element={<State />} />
                        <Route path="/Setup/divisions" element={<Division />} />
                        <Route path="/Setup/products" element={<Product />} />
                        <Route path="/Setup/aop" element={<Aop />} />
                        <Route path="/Setup/employee" element={<Employee />} />
                      
                      </>
                    )}
                  </Routes>
                </TicketProvider>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
            <Route path="password-change" element={<ChangePass />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
