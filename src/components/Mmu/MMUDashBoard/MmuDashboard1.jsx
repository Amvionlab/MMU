import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import useFetch from "../../../hooks/useFetch";
import { baseURL } from "../../../config.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

const headers = [
  "id",
  "employee_id",
  "employee_name",
  "check_in_time",
  "check_out_time",
  "total_hours",
  "date",
  "department",
];

function MmuDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [date, setDate] = useState({ fromDate: "", endDate: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { mmu } = useParams(); 
  const { allData } = useFetch(`${baseURL}/backend/fetchbio.php`);

  useEffect(() => {
    if (date.endDate || date.fromDate) {
      const filter = allData.filter((data) => {
        const dataDate = data.date;
        const start = date.fromDate || "1900-01-01";
        const end = date.endDate || "2100-01-01";
        return dataDate >= start && dataDate <= end;
      });

      setFilteredData(filter);
    } else {
      setFilteredData(allData);
    }
  }, [date.endDate, date.fromDate, allData]);

  const exportToCSV = () => {
    const csvRows = [];

    // Add the header row
    csvRows.push(headers.map((header) => header.replace(/_/g, " ")).join(","));

    // Add data rows
    filteredData.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "undefined" ? "N/A" : `"${value}"`;
      });
      csvRows.push(values.join(","));
    });

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "table_data.csv");
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Table Data", 14, 10);

    const tableData = filteredData.map((row) =>
      headers.map((header) => row[header] || "N/A")
    );

    doc.autoTable({
      head: [headers.map((header) => header.replace(/_/g, " "))],
      body: tableData,
    });

    doc.save("table_data.pdf");
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
        <body>${printContent}</body>
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
              onChange={(e) =>
                setDate((prev) => ({ ...prev, fromDate: e.target.value }))
              }
              className="border px-1 py-0.5 ml-2"
            />
                <label className="font-semibold text-red-600">End Date:</label>
            <input
              type="date"
              value={date.endDate}
              onChange={(e) =>
                setDate((prev) => ({ ...prev, endDate: e.target.value }))
              }
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
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-8 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    {Object.values(row).map((value, index) => (
                      <TableCell
                        key={index}
                        style={{
                          fontWeight: "500",
                          fontSize: "12px",
                          padding: "11px",
                        }}
                      >
                        {value || "N/A"}
                      </TableCell>
                    ))}
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
