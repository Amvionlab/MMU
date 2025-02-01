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
  "Final Diagnosis",
];


const district = {
  1: "FECC9978-D197-48D5-B2C3-08D88CB5E495", // Kanyakumari
  2: "A12F546C-9C01-4728-B2C5-08D88CB5E495", // Krishnagiri
  3: "6FB52F55-B3AF-4E77-B2C9-08D88CB5E495", // Nilgiris
  4: "419641A7-484A-4BA7-B2D1-08D88CB5E495", // Tenkasi
  5: "7D425ED5-E52C-49B2-B2D4-08D88CB5E495", // Tirunelveli
  6: "A521A592-7AA4-4FBC-B2D6-08D88CB5E495", // Thoothukudi
  7: "6E5711A5-E067-4146-B2DD-08D88CB5E495", // Virudhunagar
};



const PatientsReport = () => {
  
  const [patientsPage, setPatientsPage] = useState(0);
  const [patientsRowsPerPage, setPatientsRowsPerPage] = useState(10);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [data, setData] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  
  const { mmu } = useParams();
  const selectedDistrictId = parseInt(mmu, 10); // Convert `mmu` to an integer

  const [fromDate, setFromDate] = useState(formattedToday);
  const [toDate, setToDate] = useState(formattedToday);
  
  const url = "https://ez-hms-prod-app-ser.azurewebsites.net/api/MyReports/patientRegister";


  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
  
    // Ensure FromDate is not later than ToDate
    if (new Date(newFromDate) > new Date(toDate)) {
      alert("From Date cannot be later than To Date.");
      return;
    }
  
    setFromDate(newFromDate);
  };
  
  const handleToDateChange = (event) => {
    const newToDate = event.target.value;
  
    // Ensure ToDate is not earlier than FromDate
    if (new Date(newToDate) < new Date(fromDate)) {
      alert("To Date cannot be earlier than From Date.");
      return;
    }
  
    setToDate(newToDate);
  };

  useEffect(() => {
    const fetchData = async () => {
  
  
      const formattedFromDate = new Date(fromDate);
      const formattedToDate = new Date(toDate);
  
      // Adjust times for the start and end of the date range
      formattedFromDate.setUTCHours(0, 0, 0, 0); // Start of the day
      formattedToDate.setUTCHours(23, 59, 59, 999); // End of the day
  
      const payload = {
        FromDate: formattedFromDate.toISOString(),
        ToDate: formattedToDate.toISOString(),
        TenantId: "155df572-7df7-4d98-8f2d-08dd1f702ff1",
        BranchId: "2c1fdf05-7f1b-473e-9875-2545023d53ed",
        DistrictId: district[selectedDistrictId], // Get district ID from the URL
      };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error('Failed to fetch data');
  
        const result = await response.json();
        console.log("API Response:", result);
  
        const apiData = result.patientComplaints.map((complaint) => ({
          patientName: complaint.patreg.firstname || 'N/A',
          registrationNumber: complaint.patreg.regNum || 'N/A',
          contactNumber: complaint.patreg.mobile || 'N/A',
          age: complaint.patreg.age || 'N/A',
          district: complaint.patreg.district || 'N/A',
          gender: complaint.patreg.gender || 'N/A',
          provisionalDiagnosis: complaint.complaint.name || 'N/A',
          finalDiagnosis: complaint.complaint.name || 'N/A',
        }));
      console.log("apidatea",apiData);
        // Filter by district if needed
        const filteredPatients = apiData.filter(complaint =>
          complaint.district &&
          district[selectedDistrictId] &&
          complaint.district.toLowerCase() === district[selectedDistrictId].toLowerCase()
        );
  
        setData(filteredPatients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [fromDate, toDate, selectedDistrictId]); // Re-run when dates or district ID change

 
  

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
  
  

  const filteredPatientsData = data.filter((item) =>
    // item.patientName?.toLowerCase().includes(searchPatientName.toLowerCase())
  searchPatientName ? item.patientName.toLowerCase().includes(searchPatientName.toLowerCase()) : true
  );
  console.log(filteredPatientsData)
  // const displayedPatientsData = filteredPatientsData.slice(
  //   patientsPage * patientsRowsPerPage,
  //   patientsPage * patientsRowsPerPage + patientsRowsPerPage
  // );

  const displayedPatientsData = filteredPatientsData.slice(
    patientsPage * patientsRowsPerPage,
    patientsPage * patientsRowsPerPage + patientsRowsPerPage
  );
  

  

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add a title to the document
    doc.text(`Patients Report for ${content.props.children}`, 14, 10);
  
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
        <body>
        <h1>Patients Report for ${content.props.children}</h1>
        ${printContent}
        
        </body>
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
    onChange={(e) => {
      const newFromDate = e.target.value;
      setFromDate(newFromDate);

      // Adjust the min value of To Date to the selected From Date
      if (new Date(newFromDate) > new Date(toDate)) {
        setToDate(newFromDate);
      }
    }}
    className="border px-1 py-0.5 ml-2"
    max={toDate} // Prevent selecting From Date later than To Date
  />
</div>

<div className="flex items-center">
  <label className="font-semibold text-red-600">To Date:</label>
  <input
    type="date"
    value={toDate}
    onChange={(e) => {
      const newToDate = e.target.value;
      setToDate(newToDate);

      // Adjust the max value of From Date to the selected To Date
      if (new Date(newToDate) < new Date(fromDate)) {
        setFromDate(newToDate);
      }
    }}
    className="border px-1 py-0.5 ml-2"
    min={fromDate} // Prevent selecting To Date earlier than From Date
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
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.patientName}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.registrationNumber}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.contactNumber}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.age}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.gender}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.provisionalDiagnosis}</TableCell>
        <TableCell style={{ fontWeight: '400', fontSize: '12px', padding: '11px' }}>{row.finalDiagnosis}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} style={{ textAlign: "center" }}>
        No data available for the selected district.
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