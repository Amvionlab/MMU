import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { CiExport } from "react-icons/ci";
import { AiFillFilePdf } from "react-icons/ai";
import { BsPrinter } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";


  // Define the headers
  const headers = [
    "S.No",
    "Patient Name",
    "Doctor Name",
    "Drug Name",
    "Category",
    "Quantity",
    "Bill Date",
  ];

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

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add a title to the document
    doc.text("Medicine Report", 14, 10);
  
    // Format data to match autoTable's required structure
    const tableData = filteredData.map((row) => [
      row.patientName || "N/A",
      row.doctorName || "N/A",
      row.medicineName || "N/A",
      row.medicineCategory || "N/A",
      row.qty || "N/A",
      formatBillDate(row.billDate) || "N/A",
    ]);
  
    // Use autoTable to generate the table
    doc.autoTable({
      head: [headers], // Column headers
      body: tableData, // Table rows
      startY: 20, // Y position of the table (adjust if necessary)
    });
  
    // Save the generated PDF file
    doc.save("medicine_report.pdf");
  };
  
  const printTable = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.open();
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
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

          {/* <div className="flex items-center">
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
          </div> */}

         
        </div>
        <button
          onClick={exportToCSV}
          className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
        >
          
          <CiExport className="mr-1" /> 
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Export CSV
          </span>
        </button>
        <button
                      onClick={downloadPDF}
                      className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
                    >
                      <AiFillFilePdf className="mr-1" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Download PDF
                      </span>
                    </button>
                    <button
                      onClick={printTable}
                      className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
                    >
                      <BsPrinter className="mr-1" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Print Table
                      </span>
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

      <div id="table-content">
  <Table sx={{ minWidth: 650 }} aria-label="Medicine Report" className="mt-2 h-full bg-box">
    <TableHead>
      <TableRow>
        {headers.map((header, index) => (
          <TableCell
            key={index}
            style={{ fontWeight: "600", fontSize: "14px", padding: "12px" }}
          >
            {header.replace(/_/g, " ")}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {displayedData.length > 0 ? (
        displayedData.map((row, index) => (
          <TableRow key={index}>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {(index + 1) + (page * rowsPerPage)}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {row.patientName || "N/A"}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {row.doctorName || "N/A"}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {row.medicineName || "N/A"}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {row.medicineCategory || "N/A"}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {row.qty || "N/A"}
            </TableCell>
            <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>
              {formatBillDate(row.billDate)}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} style={{ textAlign: "center" }}>
            No data available for the selected date range.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>

    </div>
  );
};

export default MedicineReport;