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
  const [formData, setFormData] = useState({ name: "" });
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
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [originalName, setOriginalName] = useState("");



  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/backend/fetchProduct.php`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);



  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
    setOriginalName(currentName); // Save the original name
  };

  // Save button click handler
  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`${baseURL}/backend/product_add.php?action=update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: newName }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Product updated successfully.");
        fetchData(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location.");
    }

    setEditingId(null);
  };

  const handleStatusToggle = async (user) => {
    fetchUsers();
    try {
      
      const newStatus = user.is_active === 0 ? 1 : 0; // Toggle the status
      console.log("Toggling status for ID:", user.id);

      const response = await fetch(`${baseURL}/backend/product_add.php?action=toggleStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id })
      });

      const result = await response.json();
      console.log("Response from server:", result);

      if (result.success) {
        fetchUsers();
        toast.success(`Status updated to ${newStatus === 1 ? "Active" : "Inactive"}`);
        
        // Update the users list after the toggle
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, is_active: newStatus } : u
          )
        );
        fetchUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  }; 


  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseURL}/backend/product_add.php?action=getAllLocations`);
      const data = await response.json();

      if (data.success) {
        // Ensure that is_active is treated as a number (1 or 0)
        const usersWithStatus = data.locations.map(user => ({
          ...user,
          is_active: parseInt(user.is_active)  // Convert to integer
        }));
        setUsers(usersWithStatus); // Set users correctly
      } else {
        console.error("Error fetching locations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // Cancel button click handler
  const handleCancelClick = () => {
    setNewName(originalName); // Reset to original name
    setEditingId(null);
  };

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
    if (editingId === null) {
      // Add new location
      try {
        const response = await fetch(`${baseURL}/backend/product_add.php?action=add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Product added successfully.");
          fetchData();
          setFormData({ name: "" }); // Reset form
          setShowForm(false); // Hide form after submission
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error adding location:", error);
        toast.error("Failed to add location.");
      }
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
    link.setAttribute("download", "Product.csv");
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
    XLSX.writeFile(workbook, "Product.xlsx");
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
      pdf.save("Product.pdf");
      document.body.removeChild(tableClone);
    });
  };

  // Calculate the current offset based on current page and rows per page
  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second h-full max-w-full text-xs mx-auto p-0 lg:overflow-y-hidden font-poppins">
      {showForm && (
        <div className="max-w-full mb-0.5 p-4 bg-box font-mont">
          <form onSubmit={handleSubmit} className="space-y-4 text-label">


            <div className="font-mont font-bold text-2xl mb-4 text-center">Add Product </div>

            <div className="text-center">
              <label className="text-sm font-semibold text-prime mr-2 w-14 ">Name</label>

            </div>

            <div className="mb-2 mr-4 text-center">
              <input
                type="text"
                name="name"
                placeholder="Enter Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="flex-grow text-xs w-60 border border-gray-400 p-3 rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
              />
              <button
                type="submit"
                className="ml-5 bg-prime mb-4 font-mont font-semibold text-md text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      )}

      <div className="bg-box h-full p-4 font-mont">
        <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
          <span>
            Product Data
            <button
              onClick={() => setShowForm(!showForm)}
              className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-xs text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
            >
              {showForm ? "Close" : "+ Add Product"}
            </button>
          </span>
          <div>
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
          <span className="text-xs flex items-center gap-4">

            <div className="flex gap-2">
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
            </div>
          </span>

        </h3>
        

        <Table className="filter-table">
          <TableHead className="font-bold">
            <TableRow>
              {["Id", "Name", "Action", "is_Active"].map((header, index) => (
                <TableCell key={index} align="center">
                  <div className="flex items-center font-bold justify-center header">
                    <span>{header}</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTickets.map((user, index) => (
              <TableRow key={user.id} className="bg-box text-fontadd text-center font-medium">
                <TableCell className="border-t py-1 px-0.5" align="center" style={{ padding: "8px 1px" }}>
                  {index + 1 + offset}
                </TableCell>
                <TableCell className="border-t py-1 px-0.5" align="center" style={{ padding: "8px 1px" }}>
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell align="center" style={{ padding: "8px 1px" }}>
                  {editingId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(user.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user.id, user.name)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </TableCell>

                <TableCell align="center" style={{ padding: "8px 1px" }}>
                  <button
                    onClick={() => handleStatusToggle(user)} // Pass the entire user object
                    className={`px-2 py-1 rounded ${user.is_active == 1 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {user.is_active == 1 ? "Active" : "Inactive"}
                    
                  </button>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>



      </div>
    </div>

  );
};

export default Form;
