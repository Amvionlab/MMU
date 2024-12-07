import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../config.js";
import { FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserContext } from "../UserContext/UserContext.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

const Form = () => {
  const [formData, setFormData] = useState({ domain: "" });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({ id: false, name: false });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchStatus.php`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    const fileExtension = file ? file.name.split(".").pop().toLowerCase() : "";

    if (file && allowedExtensions.includes(fileExtension)) {
      setAttachment(file);
      setAttachmentError("");
    } else {
      setAttachment(null);
      setAttachmentError(
        "Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed."
      );
    }
  };

  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTicketsPerPage(value);
    setCurrentPage(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (attachment) {
      form.append("attachment", attachment);
    }

    try {
      const response = await fetch(`${baseURL}/backend/employee_add.php`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
      }

      const result = await response.json();

      if (result.message === "Status already exists.") {
        setSubmissionStatus({ success: false, message: result.message });
        toast.error(result.message);
      } else if (result.message === "Status added successfully.") {
        setSubmissionStatus({ success: true, message: result.message });
        toast.success(result.message);
      } else {
        throw new Error("Unexpected response message.");
      }
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: "There was a problem with your fetch operation: " + error.message,
      });
      toast.error("There was a problem with your fetch operation: " + error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e, field, type) => {
    const value = e.target.value.toLowerCase();
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: { type, value },
    }));
  };

  useEffect(() => {
    let filtered = [...users];
    Object.keys(filters).forEach((field) => {
      const { type, value } = filters[field];
      if (value) {
        filtered = filtered.filter((ticket) => {
          const fieldValue = ticket[field];

          if (fieldValue == null) {
            if (type === "contain" || type === "equal to") return false;
            if (type === "not contain") return true; 
            if (type === "more than" || type === "less than") return false;
          }

          const fieldValueStr = fieldValue.toString().toLowerCase();
          const valueStr = value.toLowerCase();

          if (type === "contain") return fieldValueStr.includes(valueStr);
          if (type === "not contain") return !fieldValueStr.includes(valueStr);
          if (type === "equal to") return fieldValueStr === valueStr;
          if (type === "more than") return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than") return parseFloat(fieldValue) < parseFloat(value);
          return true;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const exportCSV = () => {
    const headers = Array.from(document.querySelectorAll(".header span")).map(header => header.textContent.trim());
    const rows = Array.from(document.querySelectorAll("table tr")).slice(1).map(row =>
      Array.from(row.querySelectorAll("td")).map(td => td.textContent.trim())
    );

    const filteredRows = rows.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain"))
    );

    const csvContent = [headers.join(","), ...filteredRows.map(row => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Status.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const table = document.querySelector(".filter-table");
    if (!table) return;

    const headers = Array.from(document.querySelectorAll(".header span")).map(header => header.textContent.trim());
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(td => td.innerText.trim())
    );

    const filteredRows = rows.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain"))
    );

    const data = [headers, ...filteredRows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Status.xlsx");
  };

  const exportPDF = () => {
    const table = document.querySelector(".filter-table");
    if (!table) return;

    const tableClone = table.cloneNode(true);
    tableClone.querySelectorAll(".filter").forEach(filter => filter.remove());
    document.body.appendChild(tableClone);

    html2canvas(tableClone).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Status.pdf");
      document.body.removeChild(tableClone);
    });
  };

  // Calculate the current offset based on current page and rows per page
  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second h-full max-w-full text-xs mx-auto p-1 lg:overflow-y-hidden font-poppins">
      {showForm && (
        <div className="max-w-full mb-1 p-4 bg-box font-mont">
          <form onSubmit={handleSubmit} className="space-y-4 text-label">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
              <div className="font-mont font-semibold text-2xl mb-4">Add Status :</div>
              <div className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Status Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                />
                <button
                  type="submit"
                  className="ml-5 bg-prime font-mont font-semibold text-md text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-box h-full p-4 font-mont">
        <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
          <span>
            Status Data
            <button
              onClick={() => setShowForm(!showForm)}
              className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-sm text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
            >
              {showForm ? "Close" : "+ Add Status"}
            </button>
          </span>
          <span className="text-xs flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
              Rows per page:
            </label>
            <input
              type="number"
              id="rowsPerPage"
              value={ticketsPerPage}
              onChange={handleRowsPerPageChange}
              className="w-16 px-2 py-2 border-2 rounded text-gray-900 ml-2 mr-2"
              min="0"
            />
            <button
              onClick={exportCSV}
              className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
            >
              CSV
            </button>
            <button
              onClick={exportExcel}
              className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
            >
              Excel
            </button>
            <button
              onClick={exportPDF}
              className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
            >
              PDF
            </button>
          </span>
          <button
            onClick={() => navigate("/setup/substatus")}
            className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
          >
            Sub Status
          </button>
        </h3>

        <TableContainer component={Paper}>
          <Table className="filter-table">
            <TableHead className="font-bold">
              <TableRow>
                {["Id", "Name"].map((header, index) => (
                  <TableCell key={index} align="center">
                    <div className="flex items-center justify-center header">
                      <span>{header}</span>
                      
                    </div>
                    
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTickets.map((user, index) => (
                <TableRow key={user.id} className="bg-box text-fontadd text-center font-medium">
                  <TableCell className="border-t py-3 px-3" align="center">
                    {index + 1 + offset}
                  </TableCell>
                  <TableCell className="border-t py-3 px-3" align="center">
                    {user.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
      </div>
    </div>
  );
};

export default Form;
