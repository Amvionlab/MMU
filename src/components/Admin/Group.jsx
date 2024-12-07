import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext.jsx';

const Form = () => {
  const [formData, setFormData] = useState({ name: "" });
  const { user } = useContext(UserContext);

  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({ id: false, group: false });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchGroup.php`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTicketsPerPage(!isNaN(value) && value >= 1 ? value : 1);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);

    try {
      const response = await fetch(`${baseURL}/backend/group_add.php`, {
        method: "POST",
        body: form,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      if (result.message === 'Group already exists.') {
        setSubmissionStatus({ success: false, message: result.message });
        toast.error(result.message);
      } else if (result.message === 'Group added successfully.') {
        setSubmissionStatus({ success: true, message: result.message });
        toast.success(result.message);
        window.location.reload();
      } else {
        throw new Error("Unexpected response message.");
      }
    } catch (error) {
      setSubmissionStatus({ success: false, message: error.message });
      toast.error("Error: " + error.message);
    }
  };

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
          const fieldValue = (user[field] || "").toString().toLowerCase();
          if (type === "contain") return fieldValue.includes(value);
          if (type === "not contain") return !fieldValue.includes(value);
          if (type === "equal to") return fieldValue === value;
          if (type === "more than") return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than") return parseFloat(fieldValue) < parseFloat(value);
          return true;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const exportCSV = () => {
    const headers = ["Id", "Group"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(user => `${user.id},${user.group}`)
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    link.setAttribute("download", "Group.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const headers = ["Id", "Group"];
    const data = [headers, ...filteredUsers.map(user => [user.id, user.group])];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Group.xlsx');
  };

  const exportPDF = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;

    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Group.pdf');
    });
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-h-5/6 max-w-full text-xs mx-auto p-2 lg:overflow-y-hidden h-auto ticket-scroll font-poppins">
      {showForm && (
        <div className="max-w-full m-2 mb-4 p-4 bg-box rounded-lg font-mont">
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4">
                  Add Group:
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Group Name"
                    value={formData.name}
                    onChange={handleChange}
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
        </div>
      )}

      <div className="max-w-1/2 m-2 bg-box p-4 rounded-lg font-mont">
        <div className="ticket-table mt-4">
          <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              Group Data
              <button
                onClick={() => setShowForm(!showForm)}
                className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-sm text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
              >
                {showForm ? "Close" : "+ Add Group"}
              </button>
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
              <button onClick={exportCSV} className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none">CSV</button>
              <button onClick={exportExcel} className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none">Excel</button>
              <button onClick={exportPDF} className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none">PDF</button>
            </span>
          </h3>
          <div className="overflow-x-auto ">
          <table className="min-w-full border bg-second rounded-lg overflow-hidden filter-table mt-5">
            <thead className="bg-second border-2 border-prime text-prime font-semibold font-poppins text-fontadd">
              <tr>
                {["Id", "Group"].map((header, index) => (
                  <td key={index} className="w-1/6 py-4 px-4">
                    <div className="flex items-center justify-center">
                      <div className="header flex">
                        <span>{header}</span>
                        <FaFilter
                          className="cursor-pointer ml-3"
                          onClick={() => setShowFilter(prevState => ({
                            ...prevState,
                            [header.toLowerCase()]: !prevState[header.toLowerCase()]
                          }))}
                        />
                      </div>
                    </div>
                    {showFilter[header.toLowerCase()] && (
                      <div className="mt-2 bg-prime p-2 rounded shadow-md filter">
                        <select
                          onChange={(e) => handleFilterChange(e, header.toLowerCase(), e.target.value)}
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
                          onChange={(e) =>
                            handleFilterChange(
                              e,
                              header.toLowerCase(),
                              filters[header.toLowerCase()]?.type || "contain"
                            )
                          }
                          className="p-1 border rounded text-prime w-full"
                        />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((user, index) => (
                <tr key={user.id} className="bg-white text-fontadd text-center font-medium">
                  <td className="border-t py-4 px-4">{index + 1 + offset}</td>
                  <td className="border-t py-4 px-4">{user.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="pagination mt-4 flex justify-center font-semibold">
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
    </div>
  );
};

export default Form;
