import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'; 

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
      <div>
        <label>Search Patient:</label>
        <input
          type="text"
          onChange={e => setSearchPatientName(e.target.value)}
          placeholder="Enter a patient name"
          className='border ml-2'
        />
      </div>
    
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
        </div>
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredPatientsData.length}
        page={patientsPage}
        rowsPerPage={patientsRowsPerPage}
        onPageChange={(event, newPage) => setPatientsPage(newPage)}
        onRowsPerPageChange={event => {
          setPatientsRowsPerPage(parseInt(event.target.value, 10));
          setPatientsPage(0);
        }}
      />

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
