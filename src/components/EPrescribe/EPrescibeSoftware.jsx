import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';

function EPrescribeSoftware() {
  const [data, setData] = useState([]); // State to store API data
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectMedicineName, setSelectMedicineName] = useState("");
  const [activeReport, setActiveReport] = useState("medicine"); // Track which report is active
  const [stockPage, setStockPage] = useState(0);
const [stockRowsPerPage, setStockRowsPerPage] = useState(5);
const [patientsPage, setPatientsPage] = useState(0);
const [patientsRowsPerPage, setPatientsRowsPerPage] = useState(5);



  const { mmu } = useParams();
  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/SalesProductwiseList";

  const payload = {
    FromDate: "2024-12-01T18:30:00Z",
    ToDate: "2024-12-02T18:29:59Z",
    TenantId: "6bced242-032d-47d6-e7cb-08d8f2bf3f35",
    BranchId: "82b28344-d04e-41a0-6465-08d8f2bf3fc3"
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        console.log('API Response:', result); // Log the response for inspection

        // Flatten the nested arrays in returnValue and set it to data
        const apiData = result.details?.returnValue?.flat() || [];
        setData(apiData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pagination Logic
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(data.map((row) => row.medicineId)); // Use medicineId as the unique identifier
    } else {
      setSelectedRows([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBranchFilter = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleMedicineNameFilter = (event) => {
    setSelectMedicineName(event.target.value);
  };

  const handleChangeStockPage = (event, newPage) => {
    setStockPage(newPage);
  };
  
  const handleChangeStockRowsPerPage = (event) => {
    setStockRowsPerPage(parseInt(event.target.value, 10));
    setStockPage(0);
  };
  
  const handleChangePatientsPage = (event, newPage) => {
    setPatientsPage(newPage);
  };
  
  const handleChangePatientsRowsPerPage = (event) => {
    setPatientsRowsPerPage(parseInt(event.target.value, 10));
    setPatientsPage(0);
  };
  

  // Ensure data is always treated as an array
  const filteredData = Array.isArray(data) ? data.filter((row) =>
    (selectedBranch ? row.branchName === selectedBranch : true) &&
    (selectMedicineName ? row.medicineName.toLowerCase().includes(selectMedicineName.toLowerCase()) : true)
  ) : [];

  const displayedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueBranches = [...new Set(filteredData.map((row) => row.branchName))];

  // Dummy data for other reports
  const dummyStockData = [
    { productName: 'Product 1', quantitySold: 20, currentStock: 50 },
    { productName: 'Product 2', quantitySold: 15, currentStock: 30 },
    { productName: 'Product 3', quantitySold: 10, currentStock: 20 },
  ];

  const dummyPatientsData = [
    { patientName: 'John Doe', doctorName: 'Dr. Smith', registrationDate: '2024-12-01' },
    { patientName: 'Jane Doe', doctorName: 'Dr. Johnson', registrationDate: '2024-12-02' },
  ];

  return (
    <main className="bg-white min-h-screen p-8">
      <section>
      <div className="flex justify-center items-center gap-4">
  <button
    className={`font-medium text-xs font-mont p-2 mt-2 rounded-md 
      ${activeReport === "medicine" ? 'bg-green-500' : 'bg-prime hover:bg-green-400'} text-white`}
    onClick={() => setActiveReport("medicine")}
  >
    Medicine Report - Patient Wise
  </button>
  <button
    className={`font-medium text-xs font-mont p-2 mt-2 rounded-md 
      ${activeReport === "stock" ? 'bg-green-500' : 'bg-prime hover:bg-green-400'} text-white`}
    onClick={() => setActiveReport("stock")}
  >
    Product Sold Vs Current Stock
  </button>
  <button
    className={`font-medium text-xs font-mont p-2 mt-2 rounded-md 
      ${activeReport === "patients" ? 'bg-green-500' : 'bg-prime hover:bg-green-400'} text-white`}
    onClick={() => setActiveReport("patients")}
  >
    Patients Register
  </button>
</div>




   
<div className="flex justify-center items-center gap-4 p-2 py-5 mt-10">
            <div>
              <label htmlFor="fromdate" className="font-medium">
                From
              </label>{" "}
              &nbsp;
              <input
                type="date"
                name="from"
                id="from"
                className="border border-black p-1 rounded-sm text-sm"
              />
            </div>
            <div>
              <label htmlFor="fromdate" className="font-medium">
                To
              </label>{" "}
              &nbsp;
              <input
                type="date"
                name="to"
                id="to"
                className="border border-black p-1 rounded-sm text-sm"
              />
            </div>
            <div>
              <label htmlFor="branch" className="font-medium">
                Branch
              </label>{" "}
              &nbsp;
              <select
                name="branch"
                id="branch"
                className="border-2 border-black p-1 rounded-sm text-sm ml-2"
                onChange={handleBranchFilter}
              >
                <option value="">All</option>
                {uniqueBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="font-medium">
                Location
              </label>{" "}
              &nbsp;
              <select
                name="branch"
                id="branch"
                className="border border-black p-1 rounded-sm text-sm"
              >
                <option value="">select location</option>
                <option value="">location1</option>
              </select>
            </div>
            <div>
              <label htmlFor="medicine" className="font-medium">
                Drug
              </label>{" "}
              &nbsp;
              <input type="text"
               name="medicine"
                id="medicine"
                 className="border-2 border-black p-1 rounded-sm text-sm"
                 onChange={handleMedicineNameFilter}
                 placeholder='Enter Drug name'
                 />
            </div>
          </div>
      </section>

      <section className="pb-10">
        {activeReport === "medicine" && (
          <>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className="mt-4">
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: "600", fontSize: "1rem"}}>Patient Name</TableCell>
                  <TableCell style={{fontWeight: "600", fontSize: "1rem"}}>Doctor Name</TableCell>
                  <TableCell style={{fontWeight: "600", fontSize: "1rem"}}>Drug Name</TableCell>
                  <TableCell style={{fontWeight: "600", fontSize: "1rem"}}>Category</TableCell>
                  <TableCell style={{fontWeight: "600", fontSize: "1rem"}}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.patientName || "N/A"}</TableCell>
                    <TableCell>{row.doctorName || "N/A"}</TableCell>
                    <TableCell>{row.medicineName || "N/A"}</TableCell>
                    <TableCell>{row.medicineCategory || "N/A"}</TableCell>
                    <TableCell>{row.qty || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        
        {activeReport === "stock" && (
  <>
    <TablePagination
      rowsPerPageOptions={[5, 10, 15]}
      component="div"
      count={dummyStockData.length}
      rowsPerPage={stockRowsPerPage}
      page={stockPage}
      onPageChange={handleChangeStockPage}
      onRowsPerPageChange={handleChangeStockRowsPerPage}
    />
    <Table sx={{ minWidth: 650 }} aria-label="stock table" className="mt-4">
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Product Name</TableCell>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Quantity Sold</TableCell>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Current Stock</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dummyStockData
          .slice(stockPage * stockRowsPerPage, stockPage * stockRowsPerPage + stockRowsPerPage)
          .map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.productName}</TableCell>
              <TableCell>{row.quantitySold}</TableCell>
              <TableCell>{row.currentStock}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </>
)}


{activeReport === "patients" && (
  <>
    <TablePagination
      rowsPerPageOptions={[5, 10, 15]}
      component="div"
      count={dummyPatientsData.length}
      rowsPerPage={patientsRowsPerPage}
      page={patientsPage}
      onPageChange={handleChangePatientsPage}
      onRowsPerPageChange={handleChangePatientsRowsPerPage}
    />
    <Table sx={{ minWidth: 650 }} aria-label="patients table" className="mt-4">
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Patient Name</TableCell>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Doctor Name</TableCell>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Registration Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dummyPatientsData
          .slice(patientsPage * patientsRowsPerPage, patientsPage * patientsRowsPerPage + patientsRowsPerPage)
          .map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.patientName}</TableCell>
              <TableCell>{row.doctorName}</TableCell>
              <TableCell>{row.registrationDate}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </>
)}

      </section>
    </main>
  );
}

export default EPrescribeSoftware;
