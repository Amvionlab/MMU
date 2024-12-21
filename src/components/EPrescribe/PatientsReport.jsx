import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'; 
import { CiExport } from "react-icons/ci";

const PatientsReport = () => {
  const [patientsPage, setPatientsPage] = useState(0);
  const [patientsRowsPerPage, setPatientsRowsPerPage] = useState(5);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [data, setData] = useState([]);
  const today = new Date();
  const initialFromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
  const initialToDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

  const [fromDate, setFromDate] = useState(initialFromDate.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(initialToDate.toISOString().split('T')[0]);

  const url = "https://ez-hms-dev-app-ser.azurewebsites.net/api/MyReports/patientRegister";

  // Fetch data from API
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
        
        // Flatten the data for the table
        const apiData = result.patientComplaints.map((complaint) => ({
          patientName: complaint.patreg.firstname || 'N/A',
          registrationNumber: complaint.patreg.regNum || 'N/A',
          contactNumber: complaint.patreg.mobile || 'N/A',
          age: complaint.patreg.age || 'N/A',
          gender: complaint.patreg.gender || 'N/A',
          provisionalDiagnosis: complaint.complaint.name || 'N/A',
          investigations: complaint.visit?.visitCode || 'N/A',
          finalDiagnosis: complaint.complaint.name || 'N/A',
          treatment: 'N/A',  // Placeholder
          result: complaint.visit?.status || 'N/A',
          additionalInfo: 'N/A',  // Placeholder
          initialMO: 'N/A',  // Placeholder
        }));

        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

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
    a.download = "patients_report.csv";
    a.click();
  };


  // Filter patients data based on search term
  const filteredPatientsData = data.filter(item =>
    item.patientName?.toLowerCase().includes(searchPatientName.toLowerCase())
  );

  // Paginate data
  const displayedPatientsData = filteredPatientsData.slice(
    patientsPage * patientsRowsPerPage,
    patientsPage * patientsRowsPerPage + patientsRowsPerPage
  );

  return (
    <>
  
    
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center justify-center space-x-4">
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
        <label className='text-prime'>Search Patient:</label>
        <input
          type="text"
          onChange={e => setSearchPatientName(e.target.value)}
          placeholder="Enter a patient name"
          className='border ml-2'
        />
      </div>
           <button
                  onClick={exportToCSV}
                  className="flex justify-center items-center text-xs hover:shadow-md rounded-full border-red-200 border bg-second p-1 font-semibold"
                >
                  <CiExport className="mr-1" /> Export
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
            setPatientsPage(0); // Reset to the first page when rows per page changes
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



      <div style={{ maxWidth: '100%', overflowX: 'auto', overflowY: 'auto', height: '400px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Patients Report" className="mt-4">
          <TableHead>
            <TableRow className="text-nowrap">
              <TableCell style={{ fontWeight: '600' }}>Patient Name</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Registration Number</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Contact Number</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Age</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Gender</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Provisional Diagnosis</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Investigations</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Final Diagnosis</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Treatment</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Result Cured / Same condition / Referred / Expired</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Additional information if any</TableCell>
              <TableCell style={{ fontWeight: '600' }}>Initial of the Medical officer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatientsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.patientName}</TableCell>
                <TableCell>{row.registrationNumber}</TableCell>
                <TableCell>{row.contactNumber}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.provisionalDiagnosis}</TableCell>
                <TableCell>{row.investigations}</TableCell>
                <TableCell>{row.finalDiagnosis}</TableCell>
                <TableCell>{row.treatment}</TableCell>
                <TableCell>{row.result}</TableCell>
                <TableCell>{row.additionalInfo}</TableCell>
                <TableCell>{row.initialMO}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PatientsReport;