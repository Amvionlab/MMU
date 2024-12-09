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
  {
    id: 1,
    medicineName: "Amiline 10mg Tablet",
    medicineCategory: "TABLETS",
    billId: "717",
    billDate: "2024-12-07T05:03:36.843",
    patientName: "Ram",
    doctorName: "GOLA SWAIN",
    batchNo: "28",
    qty: 2,
    costRate: 2.5,
    sellRate: 5.5,
    subTotal: 11,
    counterDet: "Sales Location  Chromepet",
    branchName: "Dr Abdul",
  },
  {
    id: 2,
    medicineName: "Dolo tablets 650",
    medicineCategory: "TABLETS",
    billId: "717",
    billDate: "2024-12-07T05:03:36.843",
    patientName: "Ram",
    doctorName: "GOLA SWAIN",
    batchNo: "25",
    qty: 3,
    costRate: 5,
    sellRate: 5,
    subTotal: 15,
    counterDet: "Sales Location  Chromepet",
    branchName: "Dr Abdul",
  },
  {
    id: 3,
    medicineName: "Dolo tablets 650",
    medicineCategory: "TABLETS",
    billId: "717",
    billDate: "2024-12-07T05:03:36.843",
    patientName: "Ram",
    doctorName: "GOLA SWAIN",
    batchNo: "25",
    qty: 3,
    costRate: 5,
    sellRate: 5,
    subTotal: 15,
    counterDet: "Sales Location  Chromepet",
    branchName: "Dr",
  },
  {
    id: 4,
    medicineName: "Dolo tablets 650",
    medicineCategory: "TABLETS",
    billId: "717",
    billDate: "2024-12-07T05:03:36.843",
    patientName: "Ram",
    doctorName: "GOLA SWAIN",
    batchNo: "25",
    qty: 3,
    costRate: 5,
    sellRate: 5,
    subTotal: 15,
    counterDet: "Sales Location  Chromepet",
    branchName: "qr",
  },
];

function EPrescibeSoftware() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectMedicineName, setSelectMedicineName] = useState("");
  // Handle selecting/deselecting individual rows
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleBranchFilter = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleMedicineNameFilter = (event) => {
    setSelectMedicineName(event.target.value)
  }

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

  const filteredRows = rows.filter((row) =>
    (selectedBranch ? row.branchName === selectedBranch : true) &&
    (selectMedicineName ? row.medicineName.toLowerCase().includes(selectMedicineName.toLowerCase()) : true)
  );
  


  const uniqueBranches = [...new Set(rows.map((row) => row.branchName))];
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Calculate displayed rows
  const displayedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <main className="bg-white h-full p-4">
      <section>
        <div>
          <div className="flex justify-between items-center p-10">
            <h2 className="font-semibold text-2xl">Medicine Report - Patient Wise</h2>
            <button>Product Sold vs Current Stock Report</button>
          </div>
          <div className="flex justify-evenly items-center gap-4">
            <div>
              <label htmlFor="fromdate" className="font-semibold">From</label> &nbsp;
              <input type="date" name="from" id="from" className="border-2 border-black p-1 rounded-sm text-sm" />
            </div>
            <div>
              <label htmlFor="fromdate" className="font-semibold">To</label> &nbsp;
              <input type="date" name="to" id="to" className="border-2 border-black p-1 rounded-sm text-sm" />
            </div>
            <div>
              <label htmlFor="branch" className="font-semibold">Filter by Branch</label>
              <select
                name="branch"
                id="branch"
                className="border-2 border-black p-1 rounded-sm text-sm ml-2"
                onChange={handleBranchFilter}
              >
                <option value="">All</option>
                {uniqueBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label htmlFor="location" className="font-semibold">Location</label> &nbsp;
              <select name="branch" id="branch" className="border-2 border-black p-1 rounded-sm text-sm">
                <option value="">select location</option>
                <option value="">location1</option>
              </select>
            </div> */}
            <div>
              <label htmlFor="medicine" className="font-semibold">Medicine</label> &nbsp;
              <input type="text"
               name="medicine"
                id="medicine"
                 className="border-2 border-black p-1 rounded-sm text-sm"
                 onChange={handleMedicineNameFilter}
                 />
            </div>
          </div>
        </div>
      </section>

      <section>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Table sx={{ minWidth: 650, '& .MuiTableCell-root': { padding: '4px' } }} aria-label="simple table" className="mt-4">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < filteredRows.length
                  }
                  checked={selectedRows.length === filteredRows.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Patient Name</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Doctor Name</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Drug Name</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Category</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Quantity</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Branch Name</TableCell>
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
                <TableCell>{row.patientName || 'N/A'}</TableCell>
                <TableCell>{row.doctorName || 'N/A'}</TableCell>
                <TableCell>{row.medicineName}</TableCell>
                <TableCell>{row.medicineCategory}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.branchName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}

export default EPrescibeSoftware;
