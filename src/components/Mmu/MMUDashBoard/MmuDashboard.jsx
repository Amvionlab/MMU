import React, { useState } from 'react';
import { CiExport, CiFilter } from "react-icons/ci";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function MmuDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle selecting/deselecting individual rows
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle selecting/deselecting all rows
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Calculate displayed rows
  const displayedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <main className="bg-white h-full">
      <section>
        <div className="flex justify-between items-center p-10">
          <div>
            <h2 className="font-semibold text-2xl">Bio Metric</h2>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button className="flex justify-center items-center text-sm rounded-sm bg-gray-100 p-2 font-semibold">
              <CiExport /> Export
            </button>
            <button className="flex justify-center items-center text-sm rounded-sm bg-gray-100 p-2 font-semibold">
              <CiFilter /> Filter
            </button>
            <button className="rounded-md bg-gray-400 text-sm p-2 font-semibold">
              + Add User
            </button>
          </div>
        </div>
      </section>

      <section>
      <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
          <Table sx={{ minWidth: 650, '& .MuiTableCell-root': { padding: '4px' } }} aria-label="simple table" className='mt-4'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 && selectedRows.length < rows.length
                    }
                    checked={selectedRows.length === rows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell style={{fontWeight:"600", fontSize: "1rem"}}>ID</TableCell>
                <TableCell style={{fontWeight:"600", fontSize: "1rem"}}>First Name</TableCell>
                <TableCell style={{fontWeight:"600", fontSize: "1rem"}}>Last Name</TableCell>
                <TableCell style={{fontWeight:"600", fontSize: "1rem"}}>Age</TableCell>
                <TableCell style={{fontWeight:"600", fontSize: "1rem"}}>Full Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.firstName || 'N/A'}</TableCell>
                  <TableCell>{row.lastName || 'N/A'}</TableCell>
                  <TableCell>{row.age !== null ? row.age : 'N/A'}</TableCell>
                  <TableCell>{`${row.firstName || ''} ${row.lastName || ''}`.trim()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        

        {/* Pagination */}
       
      </section>
    </main>
  );
}

export default MmuDashboard;
