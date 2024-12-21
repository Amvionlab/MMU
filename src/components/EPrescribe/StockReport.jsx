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
    "Medicine Name",
    "Medicine Category",
    "Units",
    "Total Stock",
    "Sold",
    "Generic",
    "Manufacturer",
  ];
const StockReport = () => {
  const [stockPage, setStockPage] = useState(0);
  const [stockRowsPerPage, setStockRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [soldOutData, setSoldOutData] = useState([]);
  const [currentStockDet, setCurrentStockDet] = useState([]);
  const today = new Date();
  const initialFromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, today.getUTCDate(), 0, 0, 0));
  const initialToDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));
   const [fromDate, setFromDate] = useState(initialFromDate.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(initialToDate.toISOString().split('T')[0]);

  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/ProductSoldOutMedicineList";

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        tenantId: "96e4f4cc-9452-418c-5c87-08dad9280a68",
        branchId: "773911dd-1db2-4ae4-9b59-f634ee367f0e",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const result = await response.json();
        setSoldOutData(result.soldOutDet || []);
        setCurrentStockDet(result.currentStockDet || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const filteredStockData = searchTerm
    ? soldOutData.filter(row =>
        row.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : soldOutData;

  const exportToCSV = () => {
    const csvRows = [
      "Medicine Name,Category,Units,Total Stock,Sold,Generic,Manufacturer"
    ];

    soldOutData.forEach(row => {
      const stockData = currentStockDet.find(stock => stock.medicineName === row.medicineName);
      csvRows.push(
        `${row.medicineName || "N/A"},${row.category || "N/A"},${row.unitsellprice || "N/A"},${stockData?.totalStock || "N/A"},${row.sold || "N/A"},${stockData?.genericName || "N/A"},${stockData?.medicineManufacturerName || "N/A"}`
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_report.csv";
    a.click();
  };

  // Slice filtered data based on the current page and rows per page
  const paginatedData = filteredStockData.slice(stockPage * stockRowsPerPage, (stockPage + 1) * stockRowsPerPage);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add a title to the document
    doc.text("Stock Report", 14, 10);
    
    // Map the filtered stock data to the structure needed for the table
    const tableData = filteredStockData.map((row) => {
      const stockData = currentStockDet.find(stock => stock.medicineName === row.medicineName);
      return [
        row.medicineName || "N/A",                        // Medicine Name
        row.category || "N/A",                             // Category
        row.unitsellprice || "N/A",                        // Sell Price
        stockData ? stockData.totalStock : "N/A",          // Total Stock (with fallback to "N/A")
        row.sold || "N/A",                                 // Sold Quantity
        stockData ? stockData.genericName || "N/A" : "N/A", // Generic Name (from stockData or "N/A")
        stockData ? stockData.medicineManufacturerName || "N/A" : "N/A" // Manufacturer Name (from stockData or "N/A")
      ];
    });
  
    // Use autoTable to generate the table in the PDF
    doc.autoTable({
      head: [headers], // Column headers
      body: tableData, // Table rows
      startY: 20, // Y position of the table (adjust if necessary)
    });
    
    // Save the generated PDF file
    doc.save("stock_report.pdf");
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
    <div className="bg-white min-h-screen">
      <div className="flex items-center justify-between bg-box border-b text-xs">
        <div className="flex items-center space-x-4 bg-box">
          <div className="flex items-center">
            <label className="font-semibold text-red-600">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border px-1 ml-2"
            />
          </div>

          <div className="flex items-center">
            <label className="font-semibold text-red-600">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border px-1 ml-2"
            />
          </div>
          <div>
        <label className='text-prime'>Search Product: </label>
        <input
          type="text"
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Enter a medicine name"
          className='border ml-2'
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStockData.length}
          rowsPerPage={stockRowsPerPage}
          page={stockPage}
          onPageChange={(event, newPage) => setStockPage(newPage)}
          onRowsPerPageChange={event => {
            setStockRowsPerPage(parseInt(event.target.value, 10));
            setStockPage(0); // Reset to the first page when rows per page changes
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
  <Table sx={{ minWidth: 650 }} aria-label="Stock Report" className="mt-4">
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
      {paginatedData.length > 0 ? (
        paginatedData.map((row, index) => {
          const stockData = currentStockDet.find(stock => stock.medicineName === row.medicineName);
          return (
            <TableRow key={index}>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{row.medicineName}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{row.category}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{row.unitsellprice}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{stockData ? stockData.totalStock : "N/A"}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{row.sold}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{stockData ? stockData.genericName || "N/A" : "N/A"}</TableCell>
              <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '10px' }}>{stockData ? stockData.medicineManufacturerName || "N/A" : "N/A"}</TableCell>
            </TableRow>
          );
        })
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

export default StockReport;
