import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext.jsx';

const Form = () => {
  const [formData, setFormData] = useState({
    domain: "",
   
  });
  const [columnData, setColumnData] = useState([]);
  const { user } = useContext(UserContext);
  console.log('DashBoard context value:', user);
  const [ticketsPerPage, setTicketsPerPage] = useState(10); // default to 10 rows per page
  const [currentPage, setCurrentPage] = useState(0);
  let i=1;

  const [users, setUsers] = useState([]);
  const [table, setTable] = useState([]);
  const [type_id, setTypeid] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({
    id: false,
    name: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [tempColumnName, setTempColumnName] = useState("");
  const [addingNewColumn, setAddingNewColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [initialDialogState, setInitialDialogState] = useState({});
  const [columnType, setColumnType] = useState(''); // Initialize state
  const [previousColumnName, setPreviousColumnName] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [templateColumns, setTemplateColumns] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [inactiveColumns, setInactiveColumns] = useState([]);
  const [activeColumns, setActiveColumns] = useState([]);
  const [error, setError] = useState(null);
  
  const handleAddButtonClick = () => {
    setIsInputVisible(true); // Show the input field
};

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempColumnName(dialogContent[index]);
  };

  const handleSave = async () => {
    const updatedContent = [...dialogContent];
    updatedContent[editingIndex] = tempColumnName;

    const oldName = dialogContent[editingIndex];
    const name = tempColumnName;

    try {
      //alert(`Type: ${table}\nOld Name: ${oldName}\nNew Name: ${name}`);

      const response = await fetch(`${baseURL}/backend/updateColumn.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: table, oldName, name }),
      });

      if (response.ok) {
        toast.success("Column Updated");
        // Re-fetch columns after successful update
        fetchColumns();
      } else {
        throw new Error("Failed to update column name");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving the column");
    }
    setEditingIndex(null);
  };

const handleAdd = () => {
  setAddingNewColumn(true);
};
const handleTemplateSelection = (selectedType) => {
  setColumnType(selectedType);
};


const handleSaveNewColumn = async () => {
  try {
    // Sanitize the new column name
    let sanitizedColumnName = newColumnName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    //alert(`Type: ${table}\nNew Column Name: ${sanitizedColumnName}`);

    const columnsResponse = await fetch(`${baseURL}/backend/template.php`);
    if (!columnsResponse.ok) {
      throw new Error('Failed to fetch columns');
    }
    const { columns } = await columnsResponse.json();

    // Post the sanitized column name to addColumn.php
    const response = await fetch(`${baseURL}/backend/addColumn.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ table: table, name: sanitizedColumnName, type_id:type_id }),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response result:', result);

    if (response.ok) {
      setDialogContent([...dialogContent, sanitizedColumnName]);
      setNewColumnName(''); // Reset the input field value
      setIsInputVisible(false); // Hide the input field after saving
      toast.success("Column added successfully");

    } else {
      throw new Error(result.message || "Failed to add new column");
    }
  } catch (error) {
    console.error("Error adding new column:", error);
    toast.error("Error adding new column");
  }
  setIsInputVisible(false);
};

const handleClose = () => {
  setNewColumnName(''); 
  setIsInputVisible(false); 
};

const handleDelete = async (index) => {
  const columnToDelete = dialogContent[index];

  // Confirm deletion with a browser dialog
  if (window.confirm(`Are you sure you want to delete the column "${columnToDelete}"?`)) {
    try {
      const response = await fetch(`${baseURL}/backend/deleteColumn.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: table, // Adjust as required based on your type reference
          name: columnToDelete,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Handle successful deletion
        const newDialogContent = dialogContent.filter((_, i) => i !== index);
        setDialogContent(newDialogContent);
        toast.success(result.message || 'Column deleted successfully.');
      } else {
        // Handle errors from server
        toast.error(result.message || 'Failed to delete the column. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete the column. Please try again.');
    }
  }
};

  const handleCancel = () => {
    setEditingIndex(null);
    setNewColumnName(''); 
    setIsInputVisible(false);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditValue(dialogContent[index].value);
  };

  const handleSaveClick = () => {
    const updatedContent = [...dialogContent];
    updatedContent[editingIndex].value = editValue;
    setDialogContent(updatedContent);
    setEditingIndex(null);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchType.php`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
  
        // Optionally, set default type or handle type selection
        if (data.length > 0) {
          setSelectedType(data[0].type); // Example: Set first type as default
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
  
    fetchTypes();
  }, [baseURL]);
  
  const fetchColumns = async () => {
    try {
      const templateResponse = await fetch(`${baseURL}/backend/template.php?type=${table}`);
      if (!templateResponse.ok) {
        throw new Error(`Failed to fetch template columns: ${templateResponse.statusText}`);
      }
      const templateData = await templateResponse.json();
      setDialogContent(templateData.columns || []);

      const assetTemplateResponse = await fetch(`${baseURL}/backend/asset_template.php`);
      if (!assetTemplateResponse.ok) {
        throw new Error(`Failed to fetch asset template columns: ${assetTemplateResponse.statusText}`);
      }
      const assetTemplateData = await assetTemplateResponse.json();
      setTemplateColumns(assetTemplateData.template_columns || []);

    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  // useEffect to fetch columns initially or when a dependency changes
  useEffect(() => {
    if (!table) return;
    fetchColumns();
  }, [table]);


  useEffect(() => {
    const loadColumns = async () => {
        try {
            const response = await fetch(`${baseURL}/backend/fetchTableFields.php`);
            const result = await response.json();
            
            if (response.ok && result.success) {
                setInactiveColumns(result.inactive_columns);
                setActiveColumns(result.active_columns);
            } else {
                throw new Error(result.message || "Failed to fetch columns.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    loadColumns();
}, []);


  const navigate = useNavigate();
  const handleChange = (e) => {
    setTempColumnName(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    const value = parseInt(e.target.value, 10); // Parse the input value as an integer
    if (!isNaN(value) && value >= 1) {
      setTicketsPerPage(value);
      setCurrentPage(0); // Update state only if value is a valid number >= 1
    } else {
      setTicketsPerPage(1);
      setCurrentPage(0); // Default to 1 if input is cleared or set to invalid value
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
      const response = await fetch(`${baseURL}/backend/ticket_type_add.php`, {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      setSubmissionStatus({ success: true, message: result.message });
      toast.success("Asset Type added");
      location.reload();
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message:
          "There was a problem with your fetch operation: " + error.message,
      });
    }
  };

  const handleFilterChange = (e, field, type) => {
    const value = e.target.value.toLowerCase(); // convert filter value to lowercase
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
        filtered = filtered.filter((ticket) => {
          const fieldValue = ticket[field];
  
          if (fieldValue == null) {
            if (type === "contain" || type === "equal to") return false;
            if (type === "not contain") return true; if (type === "more than" || type === "less than") return false;
          }
  
          const fieldValueStr = fieldValue.toString().toLowerCase();
          const valueStr = value.toLowerCase();
  
          if (type === "contain")
            return fieldValueStr.includes(valueStr);
          if (type === "not contain")
            return !fieldValueStr.includes(valueStr);
          if (type === "equal to")
            return fieldValueStr === valueStr;
          if (type === "more than")
            return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than")
            return parseFloat(fieldValue) < parseFloat(value);
          return true;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleTemplateClick = async (type,type_id) => {
    try {
      // Set the table type to dynamically change the table
      setTable(type);
      alert(type_id)
      setTypeid(type_id);
  
      // Fetch the columns for the selected type from template.php
      const response = await fetch(`${baseURL}/backend/template.php?type=${type}`);
      const textResponse = await response.text();
  
      // Debugging: Log the raw response
      console.log("Raw response:", textResponse);
  
      // Parse the response as JSON
      const data = JSON.parse(textResponse);
  
      // Debugging: Log the parsed data to ensure it's correct
      console.log("Parsed data:", data);
  
      // Check if the response is okay and contains the columns
      if (response.ok && data.columns) {
        // Fetch the columns from asset_template.php
        const assetTemplateResponse = await fetch(`${baseURL}/backend/asset_template.php?type=${type}`);
        const assetTemplateData = await assetTemplateResponse.json();
  
        // Get the columns that should have disabled buttons
        const templateColumns = assetTemplateData.template_columns || [];
  
        // Set the dialog content with the columns
        setDialogContent(data.columns);
        setTemplateColumns(templateColumns); // Save template columns to state
        setShowDialog(true);
      } else {
        throw new Error(data.message || "Failed to fetch columns");
      }
    } catch (error) {
      console.error("Error fetching column data:", error.message, error);
    }
  };

  const exportCSV = () => {
    // Get table headers
    const tableHeaders = Array.from(document.querySelectorAll(".header span"))
      .map(header => header.textContent.trim());
  
    // Get table data values
    const tableData = Array.from(document.querySelectorAll("table tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim())
    );
  
    // Filter out rows that contain filter content
    const filteredTableData = tableData.filter(row => 
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );
  
    // Create CSV content
    const csvContent = [
      tableHeaders.join(","),
      ...filteredTableData.map(row => row.join(","))
    ].join("\n");
  
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Asset_type.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  const exportExcel = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;
  
    // Extract table headers
    const headers = Array.from(document.querySelectorAll(".header span")).map(header => header.textContent.trim());
  
    // Extract table data values
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
      Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
    );
  
    // Filter out rows that contain filter content
    const filteredRows = rows.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );
  
    const data = [headers, ...filteredRows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Ticket_type.xlsx');
  };
  
  
  const exportPDF = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;
  
    // Create a copy of the table
    const tableClone = table.cloneNode(true);
  
    // Remove filter dropdowns and inputs from the cloned table
    tableClone.querySelectorAll('.filter').forEach(filter => filter.remove());
  
    // Center-align all table cell contents
    tableClone.querySelectorAll('th, td').forEach(cell => {
      cell.style.textAlign = 'center';
    });
  
    // Append the cloned table to the body (temporarily)
    document.body.appendChild(tableClone);
  
    // Use html2canvas to convert the cloned table to an image
    html2canvas(tableClone).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Asset_type.pdf');
  
      // Remove the cloned table from the document
      document.body.removeChild(tableClone);
    });
  };
  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-h-full max-full text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
      
       <div className="max-w-full bg-box p-3 rounded-lg font-mont">
        <div className="ticket-table mt-4">
        <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              Asset Template
            </span>
            <span className="text-xs flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
                Rows per page:
              </label>
              <input
                type="number"
                id="rowsPerPage"
                placeholder={ticketsPerPage}
                onChange={handleRowsPerPageChange}
                className="w-16 px-2 py-2 border-2 rounded text-gray-900 ml-2 mr-2"
                min="0"
              />
              <button
                onClick={exportCSV}
                className="bg-flo font-mont font-semibold text-sm text-box py-1 px-4 rounded-md shadow-md focus:outline-none"
              >
                CSV
              </button>
              <button
                onClick={exportExcel}
                className="bg-flo font-mont font-semibold text-sm text-box py-1 px-4 rounded-md shadow-md focus:outline-none"
              >
                Excel
              </button>
              <button
                onClick={exportPDF}
                className="bg-flo font-mont font-semibold text-sm text-box py-1 px-4 rounded-md shadow-md focus:outline-none"
              >
                PDF
              </button>
            </span>
          </h3>

        <table className="min-w-full border bg-second rounded-lg overflow-hidden filter-table mt-5">
            <thead className="bg-second border-2 border-prime text-prime font-semibold font-poppins text-fontadd">
           
    <tr>
      {["Id", "Type", "Group", "Action"].map((header, index) => (
        <td key={index} className="w-1/4 py-4 px-4">
          <div className="flex items-center justify-center">
          <div className="header flex">
            <span>{header}</span>
            <FaFilter
              className="cursor-pointer ml-3"
              onClick={() => setShowFilter(prevState => ({
                ...prevState,
                [header.toLowerCase().replace(" ", "")]: !prevState[header.toLowerCase().replace(" ", "")]
              }))}
            />
          </div>
        </div>
        {showFilter[header.toLowerCase().replace(" ", "")] && (
          <div className="mt-2 bg-prime p-2 rounded shadow-md filter">
            <select
              onChange={(e) => handleFilterChange(e, header.toLowerCase().replace(" ", ""), e.target.value)}
              className="mb-2 p-1 border text-prime rounded w-full"
            >
              <option value="contain">Contains</option>
              <option value="not contain">Does Not Contain</option>
              <option value="equal to">Equal To</option>
              <option value="more than">More Than</option>
              <option value="less than">Less Than</option>
            </select>
            <input
              type="text"
              placeholder="Enter value"
              onChange={(e) => handleFilterChange(e, header.toLowerCase().replace(" ", ""), filters[header.toLowerCase().replace(" ", "")]?.type || "contain")}
              className="p-1 border rounded text-prime w-full"
            />
          </div>
        )}

        </td>
      ))}
    </tr>
  </thead>
  <tbody>
  {filteredUsers
              .slice(currentPage * ticketsPerPage, (currentPage + 1) * ticketsPerPage)
              .map((user, index) => (
                <tr key={user.id} className="bg-box text-xs text-center font-medium">
                  <td className="border-t py-1 px-4">{i++}</td>
                  <td className="border-t py-1 px-4">{user.type}</td>
                  <td className="border-t py-1 px-4">{user.group}</td>
                  <td className="border-t py-1 px-4">
                  <button
  className="bg-second text-prime py-2 px-4 font-semibold rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-110 hover:bg-prime hover:text-box hover:shadow-md active:scale-95 focus:outline-none"
  onClick={() => handleTemplateClick(user.type,user.id)}
>
  Template
</button>
</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
         {/* Pagination Controls */}
         <div className="pagination mt-4 flex gap-2 justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(filteredUsers.length / ticketsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination-container"}
            pageClassName={"pagination-page"}
            pageLinkClassName={"pagination-link"}
            previousClassName={"pagination-previous"}
            nextClassName={"pagination-next"}
            breakClassName={"pagination-break"}
            activeClassName={"pagination-active"}
          />
          </div>
      </div>
    
      {showDialog && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-10">
          <div className="bg-white w-11/12 md:w-4/6 lg:w-4/6 rounded-lg shadow-lg max-h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b">
  <h4 className="text-lg font-semibold">Template Columns</h4>
  <div className="flex space-x-8 items-center">
    <button
      className=" bg-prime transition-transform duration-200 ease-in-out transform hover:scale-110 text-box font-mont font-bold text-x py-2 px-3 rounded-md shadow-md border-prime border-2 focus:outline-none"
      onClick={handleAddButtonClick}
    >
      Add +
    </button>
    <button title="close"
      className="text-xs font-bold w-4 h-4 p-2 flex items-center justify-center rounded-full border-2 border-red-600 bg-red-600 text-white transition-transform duration-200 ease-in-out transform hover:scale-110"
      onClick={() => setShowDialog(false)}
    >
      X
    </button>
  </div>
</div>


            {/* Content */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: '80vh' }}>
            <table className="min-w-full border-collapse">
  <tbody>
  <div className="grid grid-cols-3 gap-3 rounded-lg  transition-colors duration-150 p-2">
  {dialogContent.map((column, index) => (
    <div
      key={index}
      className="flex justify-between items-center border hover:bg-second rounded-lg p-2"
    >
      {/* Column name and action buttons together */}
      <div className=" text-xs font-medium flex items-center space-x-4">
        {editingIndex === index ? (
          <input
            type="text"
            value={tempColumnName}
            onChange={handleChange}
            autoFocus
            className="border rounded px-2 py-1 w-2/3 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <span>{column}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-x-1">
        {editingIndex === index ? (
          <>
            <button
              className="border-green-600  text-xs hover:text-white font-bold border-2 text-prime py-1 px-3 rounded hover:bg-green-600 transition-transform duration-200 ease-in-out transform hover:scale-110"
              onClick={handleSave}
            >
              <i className="fas fa-save mr-1"></i>
            </button>
            <button
              className="border-red-800 text-xs hover:text-white font-bold border-2 text-prime py-1 px-3 rounded hover:bg-red-800 transition-transform duration-200 ease-in-out transform hover:scale-110"
              onClick={handleCancel}
            >
              <i className="fas fa-times "></i>
            </button>
          </>
        ) : (
          <>
            <button
              className="border-blue-600 text-xs hover:text-white font-bold border-2 text-prime py-1 px-3 rounded hover:bg-blue-600 transition-transform duration-200 ease-in-out transform hover:scale-110"
              onClick={() =>
                templateColumns.includes(column)
                  ? toast.success("Default values cannot be Edited")
                  : handleEdit(index)
              }
            >
              <i className="fa fa-pencil-alt"></i>
            </button>
            <button
              className="border-red-600 text-xs border-2 hover:text-white font-bold text-prime py-1 px-3 rounded hover:bg-red-600 transition-transform duration-200 ease-in-out transform hover:scale-110"
              onClick={() =>
                templateColumns.includes(column)
                  ? toast.success("Default values cannot be Deleted")
                  : handleDelete(index)
              }
            >
              <i className="fa fa-trash  text-xs"></i>
            </button>
          </>
        )}
      </div>
    </div>
  ))}
  {isInputVisible && (
      <div className="rounded-lg flex items-center justify-center gap-2 border text-sm border-gray-200 px-2 py-1">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            autoFocus
            placeholder="Enter column "
            className="border text-xs rounded placeholder:font-normal px-3 py-1 w-full focus:outline-none focus:border-blue-500"
          />
       
          <div className="flex justify-end text-xs space-x-1">
            <button
              className="border-green-600 hover:text-white font-bold border-2 text-prime  px-3 rounded hover:bg-green-600 transition-transform duration-200 ease-in-out transform hover:scale-110"
              onClick={handleSaveNewColumn}
            ><i className="fas fa-save mr-1"></i>
              
            </button>
            <button
               className="border-gray-800 text-sm hover:text-white font-bold border-2 text-prime py-1 px-3 rounded hover:bg-gray-800 transition-transform duration-200 ease-in-out transform hover:scale-110"
               onClick={() => setIsInputVisible(false)}
            >
              <i className="fas fa-times mr-1"></i>
            </button>
          </div>
        </div>
    )}
</div>

  </tbody>
</table>

            </div>
          </div>
        </div>
      )}

  </div>
);
};


export default Form;



      
    