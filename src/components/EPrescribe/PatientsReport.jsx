import React, { useState } from 'react';
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

  const dummyPatientsData = [
    { patientName: 'John Doe', doctorName: 'Dr. Smith', registrationDate: '2024-12-01' },
    { patientName: 'Jane Doe', doctorName: 'Dr. Johnson', registrationDate: '2024-12-02' },
    // Add more dummy data as needed
  ];

  const filteredPatientsData = dummyPatientsData.filter(item =>
    item.patientName.toLowerCase().includes(searchPatientName.toLowerCase())
  );

  const displayedPatientsData = filteredPatientsData.slice(patientsPage * patientsRowsPerPage, patientsPage * patientsRowsPerPage + patientsRowsPerPage);

  return (
    <>
      <div>
        <label>Search Patient:</label>
        <input
          type="text"
          onChange={e => setSearchPatientName(e.target.value)}
          placeholder="Enter a patient name"
        />
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredPatientsData.length}
        rowsPerPage={patientsRowsPerPage}
        page={patientsPage}
        onPageChange={(event, newPage) => setPatientsPage(newPage)}
        onRowsPerPageChange={event => {
          setPatientsRowsPerPage(parseInt(event.target.value, 10));
          setPatientsPage(0);
        }}
      />
      <Table sx={{ minWidth: 650 }} aria-label="Patients Report" className="mt-4">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Patient Name</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Doctor Name</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Registration Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPatientsData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.patientName}</TableCell>
              <TableCell>{row.doctorName}</TableCell>
              <TableCell>{row.registrationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PatientsReport;