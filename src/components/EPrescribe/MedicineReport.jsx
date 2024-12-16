import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { CiExport } from "react-icons/ci";

const MedicineReport = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);

  const today = new Date();
  const initialFromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, today.getUTCDate(), 0, 0, 0));
  const initialToDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));
  
  const [fromDate, setFromDate] = useState(initialFromDate.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(initialToDate.toISOString().split('T')[0]);

  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/SalesProductwiseList";

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        FromDate: new Date(fromDate).toISOString(),
        ToDate: new Date(toDate).toISOString(),
        TenantId: "6bced242-032d-47d6-e7cb-08d8f2bf3f35",
        BranchId: "82b28344-d04e-41a0-6465-08d8f2bf3fc3"
      };
      console.log(payload);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        const apiData = result.details?.returnValue?.flat() || [];
        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const filteredData = data.filter(row =>
    (selectedBranch ? row.branchName === selectedBranch : true) &&
    (selectedMedicineName ? row.medicineName.toLowerCase().includes(selectedMedicineName.toLowerCase()) : true)
  );
  const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatBillDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(date);
  };

  const exportToCSV = () => {
    const csvRows = [];

    // Define the headers
    const headers = [
      "Patient Name",
      "Doctor Name",
      "Drug Name",
      "Category",
      "Quantity",
      "Bill Date",
    ];
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach(row => {
      const values = [
        row.patientName || "N/A",
        row.doctorName || "N/A",
        row.medicineName || "N/A",
        row.medicineCategory || "N/A",
        row.qty || "N/A",
        formatBillDate(row.billDate),
      ];
      csvRows.push(values.map(value => `"${value}"`).join(','));
    });

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'medicine_report.csv');
    a.click();
  };

  return (
    <div className="bg-box h-auto">
      <div className="flex items-center justify-between bg-box border-b text-xs">
        <div className="flex items-center space-x-4 bg-box">
        <div className="flex items-center">
            <label className="font-semibold text-red-600">Drug:</label>
            <input
              type="text"
              onChange={e => setSelectedMedicineName(e.target.value)}
              placeholder="Enter Drug"
              className="border px-1 py-0.5 ml-2"
            />
          </div>
          <div className="flex items-center">
            <label className="font-semibold text-red-600">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border px-1 py-0.5 ml-2"
            />
          </div>

          <div className="flex items-center">
            <label className="font-semibold text-red-600">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border px-1 py-0.5 ml-2"
            />
          </div>

          <div className="flex items-center">
            <label className="font-semibold text-red-600">Branch:</label>
            <select
              onChange={e => setSelectedBranch(e.target.value)}
              className="border px-1 py-0.5 ml-2"
            >
              <option value="">All</option>
              {[...new Set(data.map(row => row.branchName))].map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

         
        </div>
        <button
          onClick={exportToCSV}
          className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold"
        >
          <CiExport className="mr-1" /> Export
        </button>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{
            '& .MuiTablePagination-toolbar': {
              fontSize: '11px',
              fontWeight: 700,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '11px',
              fontWeight: 700,
            },
            '& .MuiTablePagination-select, & .MuiTablePagination-actions': {
              fontSize: '11px',
              fontWeight: 700,
            },
          }}
        />
      </div>

      <Table sx={{ minWidth: 650 }} aria-label="Medicine Report" className="mt-2 h-full bg-box">
        <TableHead>
          <TableRow>
          <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>S.No</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Patient Name</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Doctor Name</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Drug Name</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Category</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Quantity</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Bill Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedData.map((row, index) => (
            <TableRow key={index}>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{(index+1)+(page*rowsPerPage)}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.patientName || "N/A"}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.doctorName || "N/A"}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.medicineName || "N/A"}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.medicineCategory || "N/A"}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.qty || "N/A"}</TableCell>
              <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{formatBillDate(row.billDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicineReport;