import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext.jsx';

const Form = () => {
  const [formData, setFormData] = useState({
    status: '',
    substatus:'',
    transfer: '',
  });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [ipDetails, setIpDetails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        setStatuses(data.statuses);
        setIpDetails(data.substatuses);
        setFilteredUsers(data.Ipdetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getStatusName = (statusId) => {
    const status = statuses.find((status) => status.id === statusId);
    return status ? status.name : 'Unknown';
  };
  const handleImportClick = () => {
    navigate('/setup/status');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${baseURL}/backend/ipdetails_add.php`, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      if (result.message === 'IP_Address already exists.') {
        toast.error(result.message);
      } else if (result.message === 'IP_Address added successfully.') {
        toast.success(result.message);
        setFormData({ status: '', from_ip: '', to_ip: '' });
        window.status.reload();
      } else {
        throw new Error('Unexpected response message.');
      }
    } catch (error) {
      toast.error('There was a problem with your fetch operation: ' + error.message);
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
    let filtered = [...ipDetails];
    Object.keys(filters).forEach((field) => {
      const { type, value } = filters[field];
      if (value) {
        filtered = filtered.filter((ipDetail) => {
          const fieldValue = ipDetail[field]?.toString().toLowerCase() || "";

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
  }, [filters, ipDetails]);

  const exportCSV = () => {
    const headers = ["Id", "Status", "Ip_from", "Ip_to"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(ipDetail => `${ipDetail.id},${getStatusName(ipDetail.status_id)},${ipDetail.ip_from},${ipDetail.ip_to}`)
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    link.setAttribute("download", "IP_Address.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const headers = ["Id", "Status", "Ip_from", "Ip_to"];
    const data = [headers, ...filteredUsers.map(ipDetail => [
      ipDetail.id, getStatusName(ipDetail.status_id), ipDetail.ip_from, ipDetail.ip_to
    ])];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'IP_Address.xlsx');
  };

  const exportPDF = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;

    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('IP_Address.pdf');
    });
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-w-full text-xs mx-auto p-1  h-full ticket-scroll font-poppins">
      {showForm && (
        <div className="max-w-full mb-1 p-4 bg-box rounded font-mont">
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4">
                  Add Sub Status:
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 ml-10 pr-10 mb-0">
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                  >
                    <option value="" disabled>Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-48">Sub-Status</label>
                  <input
                    type="text"
                    name="substatus"
                    placeholder="Enter Sub Status"
                    value={formData.substatus}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
  <label className="text-sm font-semibold text-prime mr-2 w-32">Can Transfer?</label>
  <select
    name="transfer"
    value={formData.transfer}
    onChange={handleChange}
    required
    className="flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
  >
    <option value="" disabled>Select </option>
    <option value={1}>Yes</option>
    <option value={0}>No</option>
  </select>
</div>

               
                <div className="flex items-center mb-2 mt-4 ml-8 mr-4">
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

      <div className="max-w-1/2 bg-box p-4 rounded h-full font-mont">
        <div className="ticket-table mt-4">
          <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              Sub Status Data
              <button
                onClick={() => setShowForm(!showForm)}
                className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-sm text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
              >
                {showForm ? "Close" : "+ Add Sub Status"}
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

            <button
        onClick={handleImportClick}
        className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
      >
       
        Status
      </button>

          </h3>

          <table className="min-w-full border bg-second rounded-lg overflow-hidden filter-table mt-5">
            <thead className="bg-second border-2 border-prime text-prime font-semibold font-poppins text-fontadd">
              <tr>
                {["Id", "Sub Status","Status",  "Is transfer"].map((header, index) => (
                  <td key={index} className="w-1/6 py-4 px-4">
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
                          onChange={(e) =>
                            handleFilterChange(
                              e,
                              header.toLowerCase().replace(" ", ""),
                              filters[header.toLowerCase().replace(" ", "")]?.type || "contain"
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
              {currentTickets.map((ipDetail, index) => (
                <tr key={ipDetail.id} className="bg-white text-fontadd text-center font-medium">
                  <td className="border-t py-2.5 px-2">{index + 1 + offset}</td>
                  <td className="border-t py-2.5 px-2">{ipDetail.name}</td>
                  <td className="border-t py-2.5 px-2">{getStatusName(ipDetail.status_id)}</td>
                  <td className="border-t py-2.5 px-2">{ipDetail.is_transfer === '0' ? "No" : "Yes"}</td>

                </tr>
              ))}
            </tbody>
          </table>
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
