import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { useParams } from "react-router-dom";
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
  "Registration Number",
];

const MedicineReport = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const { mmu } = useParams();  
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const initialFromDate = new Date();; // One month back
  const initialToDate = new Date();
  
  const [fromDate, setFromDate] = useState(formattedToday);
  const [toDate, setToDate] = useState(formattedToday);
  
  const url = "https://ez-hms-prod-app-ser.azurewebsites.net/api/MyReports/SalesProductwiseList";

  // Mapping of mmu to district IDs
  const districtIdMap = {
    1: "fecc9978-d197-48d5-b2c3-08d88cb5e495", // Kanyakumari
    2: "a12f546c-9c01-4728-B2c5-08d88cb5e495", // Krishnagiri
    3: "6fb52f55-b3af-4e77-b2c9-08d88cb5e495", // Nilgiris
    4: "419641a7-484a-4ba7-b2d1-08d88cb5e495", // Tenkasi
    5: "7d425ed5-e52c-49b2-b2d4-08d88cb5e495", // Tirunelveli
    6: "a521a592-7aa4-4fbc-b2d6-08d88cb5e495", // Thoothukudi
    7: "6e5711a5-e067-4146-b2dd-08d88cb5e495", // Virudhunagar
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const formattedFromDate = new Date(fromDate);
      const formattedToDate = new Date(toDate);
  
      // Set time range for the day
      formattedFromDate.setUTCHours(0, 0, 0, 0); // Start of the day
      formattedToDate.setUTCHours(23, 59, 59, 999); // End of the day
  
      const payload = {
        FromDate: formattedFromDate.toISOString(),
        ToDate: formattedToDate.toISOString(),
        TenantId: "155df572-7df7-4d98-8f2d-08dd1f702ff1",
        BranchId: "2c1fdf05-7f1b-473e-9875-2545023d53ed", // Fixed BranchId for this request
      };
  
     
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
  
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          const allData = result.details?.returnValue?.flat() || [];
          
  
          const locationId = districtIdMap[mmu];
  
          // Filter based on locationId
          const filteredData = allData.filter(item =>
            item.locationId && item.locationId.toLowerCase() === locationId.toLowerCase()
          );
  
          setData(filteredData);
        } else {
          const text = await response.text();
          console.warn("Unexpected response:", text);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fromDate, toDate, mmu]);

  let content;

  switch (mmu) {
    case "1":
      content = <p>Kanniyakumari</p>;
      break;
    case "2":
      content = <p>Krishnagiri</p>;
      break;
    case "3":
      content = <p>Nilgiris</p>;
      break;
    case "4":
      content = <p>Tenkasi</p>;
      break;
    case "5":
      content = <p>Tirunelveli</p>;
      break;
    case "6":
      content = <p>Tuticorin</p>;
      break;
    case "7":
      content = <p>Virudhunagar</p>;
      break;
    default:
      content = <p>Dashboard Not defined</p>;
  }


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
    doc.text(`Medicine Report for ${content.props.children}`, 14, 10);
  
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
          <title>Medicine Report ${content.props.children}</title>
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
        <body>
        <h1>Medicine Report for ${content.props.children}</h1>
        ${printContent}</body>
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
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate} // Ensure fromDate cannot exceed toDate
            />
          </div>

          <div className="flex items-center">
            <label className="font-semibold text-red-600">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate} // Ensure toDate cannot be before fromDate
            />
          </div>
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

        <button onClick={downloadPDF} className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group">
          <AiFillFilePdf className="mr-1" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">Download PDF</span>
        </button>
        
        <button onClick={printTable} className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group">
          <BsPrinter className="mr-1" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">Print Table</span>
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
                  <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px 60px", }}>
                    {row.regNumber}
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