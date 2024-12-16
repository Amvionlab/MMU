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
    employee_id: "",
    username: "",
    usertype: "",
    password: "",
    aops: [],
    divisions: [],
    products: [],
    states: [],
    territories: [],
    zones: [],
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

  const updateFilters = (field, type, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: { type, value: value.toLowerCase() }
    }));
  };

  useEffect(() => {
    const filtered = users.filter(user => {
      return Object.entries(filters).every(([field, { type, value }]) => {
        const userValue = (user[field] || "").toString().toLowerCase();
        if (!value) return true;
        switch (type) {
          case "contain": return userValue.includes(value);
          case "not contain": return !userValue.includes(value);
          case "equal to": return userValue === value;
          case "more than": return parseFloat(userValue) > parseFloat(value);
          case "less than": return parseFloat(userValue) < parseFloat(value);
          default: return false;
        }
      });
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form Details:");
    console.log(formData); // Directly log the consolidated formData
  
    document.body.classList.add("cursor-wait", "pointer-events-none");
  
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, Array.isArray(value) ? value.join(",") : value));
      
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

  const exportData = (format) => {
    const table = document.querySelector(".filter-table");
    if (!table) return;

    const headers = Array.from(table.querySelectorAll(".header .head")).map(header => header.textContent.trim());
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(td => td.innerText.trim())
    ).filter(row =>
      !row.some(cell =>
        ["Contains", "Does Not Contain", "Equal To", "More Than", "Less Than"].some(text => cell.includes(text))
      )
    );

    if (format === "CSV") {
      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "Analytics.csv");
      link.click();
    }
    else if (format === "Excel") {
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Analytics.xlsx");
    }
    else if (format === "PDF") {
      html2canvas(table.cloneNode(true)).then(canvas => {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save("Analytics.pdf");
      });
    }
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  const ITEM_HEIGHT = 36;
  const ITEM_PADDING_TOP = 4;
  const MenuProps = {
    PaperProps: {
      style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 200 }
    }
  };

  const getStyles = (name, personName) => ({
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular
  });

  return (
    <div className="bg-second max-h-full max-width-full text-xs h-full ticket-scroll">
      {showForm && (
        <div className="max-w-full mb-0.5 p-2 bg-box font-mont">
          <form onSubmit={handleFormSubmit} className="space-y-4 text-label">
            <div className="text-center font-mont font-semibold text-2xl mb-4">User Details</div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-4">
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Employee Name<span className="text-red-600">*</span></label>
                <select name="employee_id" value={formData.employee_id} onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))} className="w-full text-xs font-semibold bg-box border border-gray-400 p-2 py-4 rounded outline-none">
                  <option value="" className="custom-option font-bold">Select Employee</option>
                  {employee.map(emp => (<option key={emp.id} className="custom-option" value={emp.id}>{emp.firstname} {emp.lastname}</option>))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">User Type<span className="text-red-600">*</span></label>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={formData.usertype}
                    onChange={(e) => setFormData(prev => ({ ...prev, usertype: e.target.value }))}
                    displayEmpty
                    inputProps={{ 'aria-label': 'User Type' }}
                    sx={{fontSize: '12px', padding:'0px'}}
                  >
                    <MenuItem value="" disabled>Select Type</MenuItem>
                    <MenuItem value="1">Chief</MenuItem>
                    <MenuItem value="2">Employee</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-semibold text-prime">Username<span className="text-red-600">*</span></label>
                <input type="text" name="username" value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} placeholder="Enter Username" required className="w-full font-semibold text-black/50 placeholder:text-black placeholder:font-medium text-xs bg-box border border-gray-400 p-2 py-4 rounded outline-none" />
              </div>
              {formData.usertype === "2" && (
                ["zones", "aops", "divisions", "products", "states", "territories"].map(field => (
                  <div key={field} className="flex items-center">
                    <label className="w-32 text-sm font-semibold text-prime capitalize">{field}<span className="text-red-600">*</span></label>
                    <FormControl sx={{ width: '100%', padding:'0px' }}>
                      <Select
                        sx={{fontSize: '12px', padding:'0px'}}
                        multiple
                        displayEmpty
                        value={formData[field]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field]: typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value }))}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected.length === 0 ? <p>Select</p> : selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {(allData[field] || []).map(item => (
                          <MenuItem key={item.name || item.firstname} value={item.name || item.firstname} style={getStyles(item.name || item.firstname, formData[field])} className="capitalize" sx={{fontSize: '12px'}}>
                            {item.name || item.firstname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ))
              )}
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
                  {["Id", "Employee ID", "Employee Name", "Username", "User Type", "Mobile"].map((header, index) => (
                    <TableCell key={index} className="py-4 px-4 text-prime font-semibold"><div className="flex items-center gap-2"><span className="font-semibold">{header}</span></div></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTickets.map((userdet, i) => (
                  <TableRow key={userdet.id} className="bg-box">
                    {["", "employee_id", "employee_name", "username", "typename", "mobile"].map((field, index) => (
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