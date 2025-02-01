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
import { useNavigate } from 'react-router-dom';

const headers = [
  "Employee Code",
  "Employee Name",
  "Designation",
  "Log In Time",
  "Log Out Time",
  "Total Time",
];

function MmuDashboard() {
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0];
const [date, setDate] = useState({ fromDate: currentDate, endDate: currentDate });
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
        const initialFilteredData = filterDataByDate(mergedData, date); // Default filter
  
        setFilteredData(initialFilteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [mmu, date]); // Re-fetch and filter when mmu or date changes
  
  
  const navigate = useNavigate();

  const handleApply = () => {
      navigate(-1); // Navigate to the specified route
  };

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



  const processMerging = (allData, allEmployees, mmu) => {
    // Filter employees by Dist_No (mmu)
    const filteredEmployees = allEmployees.filter(emp => emp.dist_no === mmu);

    // Helper function to format date
    const formatDateTime = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // Group the entries by EmployeeCode and date
    const groupedData = allData.reduce((acc, entry) => {
        const empCode = entry.EmployeeCode;
        const logDate = new Date(entry.LogDateTime).toISOString().split('T')[0]; // Extract the date (YYYY-MM-DD)

        if (!acc[empCode]) {
            acc[empCode] = {};
        }
        if (!acc[empCode][logDate]) {
            acc[empCode][logDate] = [];
        }
        acc[empCode][logDate].push(entry);

        return acc;
    }, {});

    // Map the grouped data to desired format
    const mergedData = Object.keys(groupedData).flatMap(empCode => {
        const employeeDays = groupedData[empCode];
        const employee = filteredEmployees.find(emp => emp.emp_id === empCode);

        return Object.keys(employeeDays).map(date => {
            const entries = employeeDays[date];

            // Sort entries by LogDateTime to ensure chronological order
            entries.sort((a, b) => new Date(a.LogDateTime) - new Date(b.LogDateTime));

            let logInTime = null;
            let logOutTime = null;
            let totalTime = null;
            const pairedEntries = [];

            // Pair "in" and "out" times
            entries.forEach(entry => {
                const logDate = new Date(entry.LogDateTime);
                if (entry.Direction === 'in') {
                    if (!logInTime) {
                        logInTime = logDate;
                    }
                } else if (entry.Direction === 'out') {
                    if (logInTime && !logOutTime) {
                        logOutTime = logDate;

                        // Calculate total time for this pair
                        const duration = new Date(logOutTime - logInTime);
                        const hours = duration.getUTCHours();
                        const minutes = duration.getUTCMinutes();
                        const seconds = duration.getUTCSeconds();
                        totalTime = `${hours}h ${minutes}m ${seconds}s`;

                        // Store the paired entry
                        pairedEntries.push({
                            EmployeeCode: empCode,
                            Date: date,
                            LogInTime: formatDateTime(logInTime),
                            LogOutTime: formatDateTime(logOutTime),
                            TotalTime: totalTime,
                            Name: employee ? employee.name : "N/A",
                            Designation: employee ? employee.designation : "N/A",
                        });

                        // Reset logInTime and logOutTime for the next pair
                        logInTime = null;
                        logOutTime = null;
                    }
                }
            });

            // Add unmatched "in" times (if any)
            if (logInTime && !logOutTime) {
                pairedEntries.push({
                    EmployeeCode: empCode,
                    Date: date,
                    LogInTime: formatDateTime(logInTime),
                    LogOutTime: "Absent",
                    TotalTime: "N/A",
                    Name: employee ? employee.name : "N/A",
                    Designation: employee ? employee.designation : "N/A",
                });
            }

            return pairedEntries;
        });
    }).flat().filter(entry => entry.Name !== "N/A"); // Flatten and filter entries with missing employee data

    // Sort merged data by Date
    mergedData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    return mergedData;
};




const filterDataByDate = (data, date) => {
  const { fromDate, endDate } = date;

  // Parse filter dates
  const fromDateObj = fromDate ? new Date(fromDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  // Adjust end date to include the entire day
  if (endDateObj) {
    endDateObj.setHours(23, 59, 59, 999);
  }

  // Filter the data based on date range
  return data.filter((entry) => {
    const logDate = new Date(entry.LogInTime); // Ensure LogInTime is a Date object

    if (fromDateObj && endDateObj) {
      return logDate >= fromDateObj && logDate <= endDateObj;
    }
    if (fromDateObj) {
      return logDate >= fromDateObj;
    }
    if (endDateObj) {
      return logDate <= endDateObj;
    }
    return true; // If no dates are provided, return all data
  });
};


const exportToCSV = () => {
  const csvRows = [];

  // Add title row
  csvRows.push(`"Bio-Metric ${content.props.children}"`);

  // Add header row
  csvRows.push(headers.join(","));

  const headerMap = {
      "Employee Code": "EmployeeCode",
      "Employee Name": "Name",
      "Designation": "Designation",
      "Log In Time": "LogInTime",
      "Log Out Time": "LogOutTime",
      "Total Time": "TotalTime",
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
      a.setAttribute("download", `bio_metric_${mmu}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  } else {
      alert("No valid data available for export.");
  }
};


const downloadPDF = () => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(`Bio-Metric ${content.props.children}`, 14, 10);

  const headerMap = {
      "Employee Code": "EmployeeCode",
      "Employee Name": "Name",
      "Designation": "Designation",
      "Log In Time": "LogInTime",
      "Log Out Time": "LogOutTime",
      "Total Time": "TotalTime",
  };

  const tableData = filteredData.map(row =>
      headers.map(header => {
          const key = headerMap[header];
          return row[key] !== undefined ? row[key] : ""; // Use an empty string if undefined
      })
  );

  if (tableData.length > 0) {
      doc.autoTable({
          head: [headers],
          body: tableData,
          startY: 20, // Start below the title
      });

      doc.save(`bio_metric_${mmu}.pdf`);
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
              <title>Bio-Metric - MMU ${mmu}</title>
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
              <h1>Bio-Metric ${content.props.children}</h1>
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
        <span className='font-bold text-prime text-xl font-poppins'>{content}</span>
      </div>

      <div className="flex items-center justify-between border-b h-full text-xs bg-box p-3">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-red-600">From Date:</label>
          <input
  type="date"
  value={date.fromDate || ""}
  onChange={(e) => setDate((prev) => ({ ...prev, fromDate: e.target.value }))}
  className="border px-1 py-0.5 ml-2"
/>
          <label className="font-semibold text-red-600">End Date:</label>
          <input
  type="date"
  value={date.endDate || ""}
  onChange={(e) => setDate((prev) => ({ ...prev, endDate: e.target.value }))}
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
            {row.EmployeeCode || "Absent"}
          </TableCell>
          <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
            {row.Name || "Absent"}
          </TableCell>
          <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
            {row.Designation || "Absent"}
          </TableCell>
          <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
            {row.LogInTime || "Absent"}
          </TableCell>
          <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
            {row.LogOutTime || "Absent"}
          </TableCell>
          <TableCell style={{ fontWeight: "500", fontSize: "12px", padding: "11px" }}>
            {row.TotalTime || "Absent"}
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
      <div className="flex justify-end fixed bottom-6 right-6">
  <button onClick={handleApply} className="bg-prime text-white px-4 py-1 rounded-sm ">Back</button>  
  </div>
    </div>
  );
}

export default MmuDashboard;


