import React, { useState, useEffect, useRef } from 'react';
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
import { MdRefresh } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const headers = [
  "S.No",
  "NAME",
  "AGE",
  "GENDER",
  "MOBILE NO",
  "DOCTORS NAME",
  "MEDICINE",
  "Qty",
  "DATE",
  "DIAGNOSIS",
  "BP",
  "HEIGHT",
  "WEIGHT",
  "BMI",
  "TEMP",
  "HR",
  "GMR",
  "DISTRICT",
  "PINCODE",
  "VILLAGE",
  "TALUK",
  "ADHAAR/ID CARD"
];

const MedicineReport = () => {
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Start with empty dates to show all data
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const SHEET_ID = "1y-qy_ZAxWy_9LtWoGN57dFH29Cz9rLFrmuNBySHXMe4";
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

  const parseDateString = (dateString) => {
    if (!dateString || dateString === "N/A" || dateString === "") {
      return null;
    }
    
    if (typeof dateString === 'string' && dateString.startsWith('Date(')) {
      const match = dateString.match(/Date\((\d+),(\d+),(\d+)\)/);
      if (match) {
        const year = match[1];
        const month = String(parseInt(match[2]) + 1).padStart(2, '0');
        const day = String(match[3]).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    
    if (typeof dateString === 'string' && dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    }
    
    if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    if (typeof dateString === 'string' && dateString.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return dateString.replace(/\//g, '-');
    }
    
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    return null;
  };

  const parseCSVLine = (line) => {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    result.push(currentValue);
    return result;
  };

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      
      const lines = csvText.split(/\r\n|\n/);
      if (lines.length === 0) return;
      
      let headerLineIndex = 0;
      let headers_csv = [];
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const testLine = lines[i].trim();
        if (testLine && (testLine.includes('Sl No') || testLine.includes('DATE') || testLine.includes('NAME'))) {
          headerLineIndex = i;
          headers_csv = parseCSVLine(lines[i]);
          break;
        }
      }
      
      if (headers_csv.length === 0) {
        headers_csv = parseCSVLine(lines[0]);
      }
      
      const headerMapping = {};
      headers_csv.forEach((header, idx) => {
        const cleanHeader = header.replace(/^"|"$/g, '').trim();
        headerMapping[cleanHeader] = idx;
      });
      
      const formatted = [];
      
      for (let i = headerLineIndex + 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        
        const getValue = (headerName) => {
          const idx = headerMapping[headerName];
          if (idx !== undefined && values[idx]) {
            return values[idx].replace(/^"|"$/g, '').trim();
          }
          return "";
        };
        
        const rawDate = getValue("DATE");
        const parsedDate = parseDateString(rawDate);
        
        formatted.push({
          slNo: getValue("Sl No"),
          name: getValue("NAME"),
          age: getValue("AGE"),
          gender: getValue("GENDkER"),
          mobileNo: getValue("MOBILE NO"),
          doctorsName: getValue("DOCTORS NAME"),
          medicine: getValue("MEDICINE"),
          qty: getValue("Qty"),
          date: parsedDate,
          rawDate: rawDate,
          diagnosis: getValue("DIAGNOSIS"),
          bp: getValue("BP"),
          height: getValue("HEIGHT"),
          weight: getValue("WEIGHT"),
          bmi: getValue("BMI"),
          temp: getValue("TEMP"),
          hr: getValue("HR"),
          gmr: getValue("GMR"),
          district: getValue("DISTRICT"),
          pincode: getValue("PINCODE"),
          village: getValue("VILLAGE"),
          taluk: getValue("TALUK"),
          adhaarId: getValue("ADHAAR/ID CARD")
        });
      }
      
      setData(formatted);
      
      // Smooth transition timeout
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
      
    } catch (err) {
      console.error("Sheet fetch error:", err);
      setIsRefreshing(false);
    }
  };
  
  // Auto refresh every 60 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchData();
  };

  // Filter data - only apply date filter if both dates are provided
  const filteredData = data.filter(row => {
    const matchesMedicine = selectedMedicineName
      ? row.medicine && row.medicine.toLowerCase().includes(selectedMedicineName.toLowerCase())
      : true;

    let matchesDate = true;
    
    if (fromDate && toDate && row.date) {
      matchesDate = row.date >= fromDate && row.date <= toDate;
    }

    return matchesMedicine && matchesDate;
  });

  const displayedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatBillDate = (date) => date || "";

  // CSV Export
  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(headers.join(','));

    filteredData.forEach(row => {
      const values = [
        row.name,
        row.age,
        row.gender,
        row.mobileNo,
        row.doctorsName,
        row.medicine,
        row.qty,
        formatBillDate(row.date),
        row.diagnosis,
        row.bp,
        row.height,
        row.weight,
        row.bmi,
        row.temp,
        row.hr,
        row.gmr,
        row.district,
        row.pincode,
        row.village,
        row.taluk,
        row.adhaarId,
      ];
      csvRows.push(values.map(v => `"${v || ''}"`).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicine_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const tableData = filteredData.map(row => [
      row.name || '',
      row.age || '',
      row.gender || '',
      row.mobileNo || '',
      row.doctorsName || '',
      row.medicine || '',
      row.qty || '',
      formatBillDate(row.date),
      row.diagnosis || '',
      row.bp || '',
      row.height || '',
      row.weight || '',
      row.bmi || '',
      row.temp || '',
      row.hr || '',
      row.gmr || '',
      row.district || '',
      row.pincode || '',
      row.village || '',
      row.taluk || '',
      row.adhaarId || '',
    ]);

    doc.autoTable({
      head: [headers.slice(1)],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save("medicine_report.pdf");
  };

  // PRINT
  const printTable = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <html>
        <head>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Medicine Report</h2>
          ${printContent}
        </body>
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
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="flex items-center">
            <label className="font-semibold text-red-600">To Date:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

        </div>

        <button onClick={handleManualRefresh} className="flex items-center text-xs border p-1 px-2" disabled={isRefreshing}>
          <MdRefresh className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} /> 
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>

        <button onClick={exportToCSV} className="flex items-center text-xs border p-1 px-2">
          <CiExport className="mr-1" /> CSV
        </button>

        <button onClick={downloadPDF} className="flex items-center text-xs border p-1 px-2">
          <AiFillFilePdf className="mr-1" /> PDF
        </button>

        <button onClick={printTable} className="flex items-center text-xs border p-1 px-2">
          <BsPrinter className="mr-1" /> Print
        </button>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </div>

      {/* Table wrapper with horizontal scroll only */}
      <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
        <div id="table-content" style={{ 
          transition: 'opacity 0.3s ease-in-out',
          opacity: isRefreshing ? 0.6 : 1
        }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index} style={{ fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <TableRow key={index} style={{ transition: 'background-color 0.2s' }}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{row.name || ""}</TableCell>
                    <TableCell>{row.age || ""}</TableCell>
                    <TableCell>{row.gender || ""}</TableCell>
                    <TableCell>{row.mobileNo || ""}</TableCell>
                    <TableCell>{row.doctorsName || ""}</TableCell>
                    <TableCell>{row.medicine || ""}</TableCell>
                    <TableCell>{row.qty || ""}</TableCell>
                    <TableCell>{formatBillDate(row.date)}</TableCell>
                    <TableCell>{row.diagnosis || ""}</TableCell>
                    <TableCell>{row.bp || ""}</TableCell>
                    <TableCell>{row.height || ""}</TableCell>
                    <TableCell>{row.weight || ""}</TableCell>
                    <TableCell>{row.bmi || ""}</TableCell>
                    <TableCell>{row.temp || ""}</TableCell>
                    <TableCell>{row.hr || ""}</TableCell>
                    <TableCell>{row.gmr || ""}</TableCell>
                    <TableCell>{row.district || ""}</TableCell>
                    <TableCell>{row.pincode || ""}</TableCell>
                    <TableCell>{row.village || ""}</TableCell>
                    <TableCell>{row.taluk || ""}</TableCell>
                    <TableCell>{row.adhaarId || ""}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
      </div>
    </div>
  );
};

export default MedicineReport;