import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CiExport } from "react-icons/ci";
import { AiFillFilePdf } from "react-icons/ai";
import { BsPrinter } from "react-icons/bs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { FaFingerprint } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { baseURL } from "../../../config.js";

const headers = [
  "Employee Code",
  "Employee Name",
  "Designation",
  "Log Date Time",
  "Download Date Time",
  "Total Time",
  "Direction",
];

function MmuDashboard() {
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [date, setDate] = useState({ fromDate: "", endDate: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { mmu } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [biometricResponse, employeeResponse] = await Promise.all([
          fetch(`${baseURL}/backend/fetchbio.php`),
          fetch(`${baseURL}/backend/fetchEmp.php`),
        ]);
        const allData = await biometricResponse.json();
        const allEmployees = await employeeResponse.json();

        const mergedData = processMerging(allData, allEmployees, mmu);
        const filteredData = filterDataByDate(mergedData, date);
        
        setFilteredData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mmu, date]);

  const processMerging = (allData, allEmployees, mmu) => {
    // Filter employees by Dist_No (mmu)
    const filteredEmployees = allEmployees.filter(emp => emp.dist_no === mmu);
  
    // Return merged data
    return allData.map(bioEntry => {
      // Find the corresponding employee for the biometric entry
      const employee = filteredEmployees.find(emp => emp.emp_id === bioEntry.EmployeeCode);
      const logDate = new Date(bioEntry.LogDateTime);
      const downloadDate = new Date(bioEntry.DownLoadDateTime);
      const totalTime = new Date(downloadDate - logDate);
  
      // Avoid NaN when calculating total time
      const hours = totalTime.getUTCHours();
      const minutes = totalTime.getUTCMinutes();
      const seconds = totalTime.getUTCSeconds();
  
      return {
        EmployeeCode: bioEntry.EmployeeCode,
        LogDateTime: bioEntry.LogDateTime,
        DownLoadDateTime: bioEntry.DownLoadDateTime,
        Direction: bioEntry.Direction,
        Name: employee ? employee.name : "N/A", // Fallback to "N/A" if employee is not found
        Designation: employee ? employee.designation : "N/A", // Fallback to "N/A"
        TotalTime: `${hours}h ${minutes}m ${seconds}s`,
      };
    }).filter(entry => entry.Name !== "N/A"); // Ensure only entries with valid names are retained
  };
  const filterDataByDate = (data, date) => {
    const { fromDate, endDate } = date;
    return data.filter(entry => {
      const logDate = new Date(entry.LogDateTime);
      
      let fromDateObj = fromDate ? new Date(fromDate) : null;
      let endDateObj = endDate ? new Date(endDate) : null;

      if (endDateObj) {
        endDateObj.setHours(23, 59, 59, 999); // Set end date to the last millisecond of the day
      }

      if (fromDateObj && endDateObj) {
        return logDate >= fromDateObj && logDate <= endDateObj;
      }

      if (fromDateObj) {
        return logDate >= fromDateObj;
      }

      if (endDateObj) {
        return logDate <= endDateObj;
      }

      return true; // No filtering applied
    });
  };

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(headers.join(",")); // Add the header row to CSV
  
    const headerMap = {
      "Employee Code": "EmployeeCode",
      "Employee Name": "Name",
      "Designation": "Designation",
      "Log Date Time": "LogDateTime",
      "Download Date Time": "DownLoadDateTime",
      "Total Time": "TotalTime",
      "Direction": "Direction"
    };
  
    // Map the filtered data to the CSV format
    filteredData.forEach(row => {
      const values = headers.map(header => {
        const key = headerMap[header];
        const value = row[key] !== undefined ? row[key] : ""; // Create value or empty
        return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
      });
      csvRows.push(values.join(",")); // Join values into a row
    });
  
    // Create a Blob and download if there is at least one row
    if (csvRows.length > 1) { 
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "table_data.csv");
      document.body.appendChild(a); // Append to body for Firefox
      a.click();
      document.body.removeChild(a); // Remove after triggering download
    } else {
      alert("No valid data available for export.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Table Data", 14, 10);
  
    const headerMap = {
      "Employee Code": "EmployeeCode",
      "Employee Name": "Name",
      "Designation": "Designation",
      "Log Date Time": "LogDateTime",
      "Download Date Time": "DownLoadDateTime",
      "Total Time": "TotalTime",
      "Direction": "Direction"
    };
  
    // Prepare valid data for PDF
    const tableData = filteredData.map(row => 
      headers.map(header => {
        const key = headerMap[header];
        return row[key] !== undefined ? row[key] : "";  // Use an empty string if undefined
      })
    );
  
    // Check if tableData has valid content
    if (tableData.length > 0) {
      doc.autoTable({
        head: [headers], // Headers for the PDF
        body: tableData,
      });
  
      doc.save("table_data.pdf"); // Save the generated PDF
    } else {
      alert("No valid data available for download.");
    }
  };

  const printTable = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.open();
    newWindow.document.write(`
      <html>
        <head>
          <title>Bio Metric - MMU ${mmu}</title>
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
          <h1>Bio Metric - MMU ${mmu}</h1>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="bg-second p-0.5">
      <div className="bg-box py-2 px-5 mb-0.5">
        <h2 className="flex text-prime gap-5 items-center text-xl font-bold mt-3">
          <FaFingerprint size={40} />
          Bio Metric
        </h2>
      </div>

      <div className="flex items-center justify-between border-b h-full text-xs bg-box p-3">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-red-600">From Date:</label>
          <input
            type="date"
            value={date.fromDate}
            onChange={(e) => setDate(prev => ({ ...prev, fromDate: e.target.value }))}
            className="border px-1 py-0.5 ml-2"
          />
          <label className="font-semibold text-red-600">End Date:</label>
          <input
            type="date"
            value={date.endDate}
            onChange={(e) => setDate(prev => ({ ...prev, endDate: e.target.value }))}
            className="border px-1 py-0.5 ml-2"
          />
        </div>
        <div className="flex space-x-2">
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
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1  bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Print Table
            </span>
          </button>
        </div>
        <div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
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
      </div>

      <div id="table-content">
        <Table
          sx={{ minWidth: 650, minHeight: 100 }}
          aria-label="simple table"
          className="bg-box text-center p-2"
        >
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
            {filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow key={i}>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.EmployeeCode || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.Name || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.Designation || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.LogDateTime || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.DownLoadDateTime || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.TotalTime || "N/A"} 
                    </TableCell>
                    <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
                      {row.Direction || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  style={{
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "14px",
                    padding: "20px",
                  }}
                >
                  No data is available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MmuDashboard;


