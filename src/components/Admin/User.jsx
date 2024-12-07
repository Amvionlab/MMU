import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext';
import TextField from '@mui/material/TextField';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Input,
  TablePagination,
} from "@mui/material";


const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    employee_id: "",
    password: ''
  });
  const { user } = useContext(UserContext);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  let i = 1;

  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({
    id: false,
    name: false,
    lastname: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [access, setAccess] = useState([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const generatePassword = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    setFormData(prevState => ({
      ...prevState,
      password: generatePassword()
    }));
  }, []);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchAccess.php`);
        const data = await response.json();
        setAccess(data);
      } catch (error) {
        console.error("Error fetching access:", error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchEmployees.php`);
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching access:", error);
      }
    };
 
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchUsers.php`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAccess();
    fetchUsers();
    fetchEmployee();
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRowsPerPageChange = (e) => {
    setTicketsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0); // Reset to the first page when rows per page changes
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.body.classList.add('cursor-wait', 'pointer-events-none');
    
    // Create a new FormData object
    const form = new FormData();
    for (const key in formData) {
        // Append each form data key-value pair to the FormData object
        form.append(key, formData[key]);
    }

    // Log the form values before submission
    console.log("Form Values:");
    for (const [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = await fetch(`${baseURL}/backend/user_add.php`, {
            method: "POST",
            body: form,
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }
        toast.success("User added");
        document.body.classList.remove('cursor-wait', 'pointer-events-none');
        window.location.reload();
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error adding user. " + error.message);
        document.body.classList.remove('cursor-wait', 'pointer-events-none');
    }
};


  const pageCount = Math.ceil(filteredUsers.length / ticketsPerPage);

  const handleFilterChange = (e, field, type) => {
    const value = e.target.value.toLowerCase();
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: { type, value }
    }));
  };

  useEffect(() => {
    let filtered = [...users];
    Object.keys(filters).forEach((field) => {
      const { type, value } = filters[field];
      if (value) {
        filtered = filtered.filter((user) => {
          const fieldValue = user[field] || '';
          const fieldValueStr = fieldValue.toString().toLowerCase();
          if (type === "contain") return fieldValueStr.includes(value);
          if (type === "not contain") return !fieldValueStr.includes(value);
          if (type === "equal to") return fieldValueStr === value;
          if (type === "more than") return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than") return parseFloat(fieldValue) < parseFloat(value);
          return false;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const exportCSV = () => {
    const tableHeaders = Array.from(document.querySelectorAll(".header .head"))
      .map(header => header.textContent.trim());

    const tableData = Array.from(document.querySelectorAll("table tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim())
    );

    const filteredTableData = tableData.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );

    const csvContent = [
      tableHeaders.join(","),
      ...filteredTableData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;

    const headers = Array.from(document.querySelectorAll(".header .head")).map(header => header.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
      Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
    );

    const filteredRows = rows.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );

    const data = [headers, ...filteredRows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Analytics.xlsx');
  };

  const exportPDF = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;

    const tableClone = table.cloneNode(true);
    tableClone.querySelectorAll('.filter').forEach(filter => filter.remove());

    tableClone.querySelectorAll('th, td').forEach(cell => {
      cell.style.textAlign = 'center';
    });

    document.body.appendChild(tableClone);

    html2canvas(tableClone).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Analytics.pdf');

      document.body.removeChild(tableClone);
    });
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-h-full max-w-full -mt-1 text-xs p-1  h-full ticket-scroll">
      {showForm && (
        <div className="max-w-full mb-0.5 p-2 bg-box  font-mont">
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              <div className=" gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4 text-center">
                  User Details
                </div>
              </div>

                 <div >
                 <div className="flex justify-center items-center mt-2">
  <label className="w-32 text-sm font-semibold text-prime text-left mr-2">
    Employee Name<span className="text-red-600 text-md font-bold">*</span>
  </label>
  <select
    name="employee_id"
    value={formData.employee_id}
    onChange={handleChange}
    className="w-80 text-center text-xs bg-box border border-gray-400 p-3 rounded-md outline-none focus:border-bgGray focus:ring-bgGray focus:shadow-prime focus:shadow-sm"
  >
    <option value="" className="custom-option">
      Select Employee
    </option>
    {employee.map((employee) => (
      <option
        key={employee.id}
        value={employee.id}
        className="custom-option"
        required
      >
        {employee.firstname}
      </option>
    ))}
  </select>
</div>

<div className="flex justify-center items-center mt-2">
  <label className="w-32 text-sm font-semibold text-prime text-left mr-2">
    Username<span className="text-red-600 text-md font-bold">*</span>
  </label>
  <input
    type="text"
    name="username"
    placeholder="Enter Username"
    value={formData.username}
    onChange={handleChange}
    required
    className="w-80 text-center text-xs bg-box border border-gray-400 p-3 rounded-md outline-none focus:border-bgGray focus:ring-bgGray focus:shadow-prime focus:shadow-sm"
  />
</div>

<div className="flex justify-center items-center mt-2">
  <label className="w-32 text-sm font-semibold text-prime text-left mr-2">
    User Type<span className="text-red-600 text-md font-bold">*</span>
  </label>
  <select
    name="usertype"
    value={formData.usertype}
    onChange={handleChange}
    className="w-80 text-center text-xs bg-box border border-gray-400 p-3 rounded-md outline-none focus:border-bgGray focus:ring-bgGray focus:shadow-prime focus:shadow-sm"
  >
    <option value="" className="custom-option">
      Select User Type
    </option>
    {access.map((access) => (
      <option
        key={access.id}
        value={access.id}
        className="custom-option"
        required
      >
        {access.name}
      </option>
    ))}
  </select>
</div>

                 </div>
              
             

              <div className="flex justify-center">
                <button
                  type="submit"
                  className=" mb-2 bg-prime font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-full w-full h-full bg-box p-5  font-mont">
        <div className="ticket-table mt-4">
          <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              User Data
              <button
                onClick={() => setShowForm(!showForm)}
                className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-xs text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
              >
                {showForm ? "Close" : "+ Add User"}
              </button>
            </span>
            <span className="">
            
              <TablePagination
          component="div"
          count={filteredUsers.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={ticketsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Rows per page"
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
            </span>
        <span className="flex gap-2">
              <button
                onClick={exportCSV}
                className="bg-second font-mont font-semibold text-xs py-1 px-4 rounded-md shadow-md focus:outline-none hover:bg-flo hover:text-white transition-all ease-in-out"
              >
                CSV
              </button>
              <button
                onClick={exportExcel}
                className="bg-second font-mont font-semibold text-xs py-1 px-4 rounded-md shadow-md focus:outline-none hover:bg-flo hover:text-white transition-all ease-in-out"
              >
                Excel
              </button>
              <button
                onClick={exportPDF}
                className="bg-second font-mont font-semibold text-xs py-1 px-4 rounded-md shadow-md focus:outline-none hover:bg-flo hover:text-white transition-all ease-in-out"
              >
                PDF
              </button>
              </span>
        
          </h3>
          <div className="overflow-x-auto ">
       
      <Table className="min-w-full">
        <TableHead className="">
          <TableRow>
            {["Id", "Employee ID", "Employee Name", "Username", "User Type", "Mobile", "Location"].map((header, index) => (
              <TableCell key={index} className="py-4 px-4 text-prime font-semibold font-poppins">
                <div className="flex items-center gap-2">
                  <span style={{padding: "4px 4px"}} className="font-semibold">{header}</span>
               
                </div>
               
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentTickets.map((userdet, i) => (
            <TableRow key={userdet.id} className="bg-box text-fontadd">
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{i + offset}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.employee_id}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.employee_name}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.username}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.typename}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.mobile}</TableCell>
              <TableCell className="border-t py-4 px-4" style={{padding: "10px 18px"}}>{userdet.location}</TableCell>
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


