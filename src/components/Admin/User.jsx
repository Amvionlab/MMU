import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../config.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserContext } from "../UserContext/UserContext";
import { useTheme, Table, TableHead, TableBody, TableRow, TableCell, Select, FormControl, MenuItem, OutlinedInput, TablePagination } from "@mui/material";
import useFetch from "../../hooks/useFetch.js";

const Form = () => {
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    usertype: "",
    mobile: "",
    email: "", // Added email field
    branch: "", // Added branch field
    employee_id: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [employee, setEmployee] = useState([]);

  const { user } = useContext(UserContext);
  const { allData } = useFetch(`${baseURL}/backend/dropdown.php`);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const generatePassword = () => {
      return Array.from({ length: 10 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62))).join('');
    };

    setFormData(prevState => ({ ...prevState, password: generatePassword() }));

    const fetchInitializedData = async () => {
      try {
        const [empResponse, userResponse] = await Promise.all([
          fetch(`${baseURL}/backend/fetchEmployees.php`),
          fetch(`${baseURL}/backend/fetchUsers.php`)
        ]);
        const [empData, userData] = await Promise.all([empResponse.json(), userResponse.json()]);
        setEmployee(empData);
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitializedData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form Details:");
    console.log(formData);
  
    document.body.classList.add("cursor-wait", "pointer-events-none");
  
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      
      form.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      const response = await fetch(`${baseURL}/backend/user_add.php`, { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Something went wrong");
  
      toast.success("User added");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error adding user. " + error.message);
    } finally {
      document.body.classList.remove("cursor-wait", "pointer-events-none");
    }
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  const MenuProps = {
    PaperProps: {
      style: { maxHeight: 36 * 4.5 + 4, width: 200 }
    }
  };

  return (
    <div className="bg-second max-h-full max-width-full text-xs h-full ticket-scroll">
      {showForm && (
        <div className="max-w-full mb-0.5 p-2 bg-box font-mont">
          <form onSubmit={handleFormSubmit} className="space-y-4 text-label">
          <div className="text-center font-mont font-semibold text-2xl mb-4">User Details</div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-4">
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">First Name<span className="text-red-600 ml-1">*</span></label>
                <input type="text" name="firstname" value={formData.firstname} onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))} placeholder="Enter First Name" required className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))} placeholder="Enter Last Name"  className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Username<span className="text-red-600 ml-1">*</span></label>
                <input type="text" name="username" value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} placeholder="Enter Username" required className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Password</label>
                <input type="text" name="password" value={formData.password} readOnly className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">User Type<span className="text-red-600 ml-1">*</span></label>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={formData.usertype}
                    onChange={(e) => setFormData(prev => ({ ...prev, usertype: e.target.value }))}
                    displayEmpty
                    inputProps={{ 'aria-label': 'User Type' }}
                    sx={{fontSize: '12px', padding:'0px'}}
                    required
                  >
                    <MenuItem value="" disabled>Select Type</MenuItem>
                    <MenuItem value="1">Admin</MenuItem>
                    <MenuItem value="2">Head</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Email<span className="text-red-600 ml-1">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="Enter Email" required className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              
             
            </div>
            <div className="flex justify-center">
              <button type="submit" className="mb-2 bg-prime font-mont font-semibold text-sm text-white py-2 px-4 rounded-md shadow-md">Submit</button>
            </div>
          </form>
        </div>
      )}
      <div className="max-w-full w-full h-full bg-box p-5 font-mont">
        <div className="ticket-table mt-4">
          <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              User Data
              <button onClick={() => setShowForm(prev => !prev)} className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-xs text-black py-2 px-8 rounded-md shadow-md">{showForm ? "Close" : "+ Add User"}</button>
            </span>
            <TablePagination component="div" count={filteredUsers.length} page={currentPage} onPageChange={(e, newPage) => setCurrentPage(newPage)} rowsPerPage={ticketsPerPage} onRowsPerPageChange={e => setTicketsPerPage(parseInt(e.target.value, 10))} labelRowsPerPage="Rows per page" />
            <span className="flex gap-2">
              {["CSV", "Excel", "PDF"].map((format) => (
                <button key={format} onClick={() => exportData(format)} className="bg-second font-mont font-semibold text-xs py-1 px-4 rounded-md shadow-md focus:outline-none hover:bg-flo hover:text-white">{format}</button>
              ))}
            </span>
          </h3>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  {["Id", "Employee Name", "Username", "User Type", "Email"].map((header, index) => (
                    <TableCell key={index} className="py-4 px-4 text-prime font-semibold"><div className="flex items-center gap-2"><span className="font-semibold">{header}</span></div></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTickets.map((userdet, i) => (
                  <TableRow key={userdet.id} className="bg-box">
                    {["","employee_name", "username", "typename", "email"].map((field, index) => (
                      <TableCell key={index} className="border-t py-4 px-4">{field ? userdet[field] : i + 1 + offset}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;