import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { useParams, Link } from "react-router-dom";
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { CiExport } from "react-icons/ci";
import { AiFillFilePdf } from "react-icons/ai";
import { BsPrinter } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";


const headers = [
  "Patient Name",
  "Registration Number",
  "Contact Number",
  "Age",
  "Gender",
  "Provisional Diagnosis",
  "Investigations",
  "Final Diagnosis",
  "Treatment",
  "Result Cured / Same condition / Referred / Expired",
  "Additional information if any",
  "Initial of the Medical officer",
];

const PatientsReport = () => {
  
  const [patientsPage, setPatientsPage] = useState(0);
  const [patientsRowsPerPage, setPatientsRowsPerPage] = useState(10);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [data, setData] = useState([]);
  const today = new Date();
  const { mmu } = useParams(); 
  const initialFromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, today.getUTCDate(), 0, 0, 0));
  const initialToDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));
  
  const [fromDate, setFromDate] = useState(initialFromDate.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(initialToDate.toISOString().split('T')[0]);

  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/patientRegister";

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        FromDate: new Date(fromDate).toISOString(),
        ToDate: new Date(toDate).toISOString(),
        TenantId: "6bced242-032d-47d6-e7cb-08d8f2bf3f35",
        BranchId: "82b28344-d04e-41a0-6465-08d8f2bf3fc3",
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        console.log(result);
        const apiData = result.patientComplaints.map((complaint) => ({
          patientName: complaint.patreg.firstname || 'N/A',
          registrationNumber: complaint.patreg.regNum || 'N/A',
          contactNumber: complaint.patreg.mobile || 'N/A',
          age: complaint.patreg.age || 'N/A',
          gender: complaint.patreg.gender || 'N/A',
          provisionalDiagnosis: complaint.complaint.name || 'N/A',
          investigations: complaint.visit?.visitCode || 'N/A',
          finalDiagnosis: complaint.complaint.name || 'N/A',
          treatment: 'N/A',
          result: complaint.visit?.status || 'N/A',
          additionalInfo: 'N/A',
          initialMO: 'N/A',
        }));

        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const exportToCSV = () => {
    const csvRows = [];
    
    // Add headers to CSV rows
    csvRows.push(headers.join(","));
    
    // Map through the displayed data and create CSV rows
    displayedPatientsData.forEach((row) => {
      const rowData = [
        row.patientName || "N/A",
        row.registrationNumber || "N/A",
        row.contactNumber || "N/A",
        row.age || "N/A",
        row.gender || "N/A",
        row.provisionalDiagnosis || "N/A",
        row.investigations || "N/A",
        row.finalDiagnosis || "N/A",
        row.treatment || "N/A",
        row.result || "N/A",
        row.additionalInfo || "N/A",
        row.initialMO || "N/A",
      ];
      csvRows.push(rowData.join(","));
    });
  
    // Create CSV blob and trigger download
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients_report.csv";
    document.body.appendChild(a); // Append to body
    a.click();
    document.body.removeChild(a); // Cleanup
  };
  
  

  const filteredPatientsData = data.filter(item =>
    item.patientName?.toLowerCase().includes(searchPatientName.toLowerCase())
  );
  
  const displayedPatientsData = filteredPatientsData.slice(
    patientsPage * patientsRowsPerPage,
    patientsPage * patientsRowsPerPage + patientsRowsPerPage
  );
  

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add a title to the document
    doc.text("Patients Report", 14, 10);
  
    // Define table data
    const tableData = displayedPatientsData.map((row) => [
      row.patientName || "N/A",
      row.registrationNumber || "N/A",
      row.contactNumber || "N/A",
      row.age || "N/A",
      row.gender || "N/A",
      row.provisionalDiagnosis || "N/A",
      row.investigations || "N/A",
      row.finalDiagnosis || "N/A",
      row.treatment || "N/A",
      row.result || "N/A",
      row.additionalInfo || "N/A",
      row.initialMO || "N/A",
    ]);
  
    // Generate the PDF table
    doc.autoTable({
      head: [headers], // Use headers array for table column titles
      body: tableData,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
    });
  
    // Save the PDF
    doc.save("patients_report.pdf");
  };
  
  
  const printTable = () => {
    const printContent = document.querySelector("table").outerHTML; // Get table HTML
    const newWindow = window.open("", "_blank", "width=800,height=600");
    
    newWindow.document.open();
    newWindow.document.write(`
      <html>
        <head>
        <title>Patients Report - MMU ${mmu}</title>
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
    <div>
      <div className="flex items-center justify-between text-xs">
        {/* Search and Date Filters */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <label className="font-semibold text-red-600">Search Patient:</label>
            <input
              type="text"
              onChange={e => setSearchPatientName(e.target.value)}
              placeholder="Enter a patient name"
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
         
          <button
  onClick={exportToCSV}
  className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
>
  <CiExport className="mr-1" />
  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    Export CSV
  </span>
</button>

<button
  onClick={downloadPDF}
  className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
>
  <AiFillFilePdf className="mr-1" />
  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    Download PDF
  </span>
</button>

<button
  onClick={printTable}
  className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 px-2 font-semibold relative group"
>
  <BsPrinter className="mr-1" />
  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    Print Table
  </span>
</button>


        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatientsData.length}
          rowsPerPage={patientsRowsPerPage}
          page={patientsPage}
          onPageChange={(event, newPage) => setPatientsPage(newPage)}
          onRowsPerPageChange={event => {
            setPatientsRowsPerPage(parseInt(event.target.value, 10));
            setPatientsPage(0);
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

      <div className="overflow-y-auto" style={{ maxHeight: '480px' }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="Patients Report" className="mt-4">
          <TableHead>
            <TableRow className="text-nowrap">
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
          {displayedPatientsData.length > 0 ? (
            displayedPatientsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px', whiteSpace: 'nowrap'  }}>{row.patientName}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.registrationNumber}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.contactNumber}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.age}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.gender}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.provisionalDiagnosis}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.investigations}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px', whiteSpace: 'nowrap'  }}>{row.finalDiagnosis}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.treatment}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.result}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.additionalInfo}</TableCell>
                <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.initialMO}</TableCell>
              </TableRow>
            ))
          ): (
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

export default PatientsReport;