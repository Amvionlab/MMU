import React, { useState } from "react";
import { CiExport, CiFilter } from "react-icons/ci";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FaFingerprint } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import useFetch from "../../../hooks/useFetch";

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Rasdoxie", firstName: "Harvadsey", age: 95 },
];
const headers = [
  "id",
  "employee_id",
  "employee_name",
  "check_in_time",
  "check_out_time",
  "date",
  "department",
];

function MmuDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { allData } = useFetch("http://localhost/MMU/backend/fetchbio.php");
  console.log(allData);
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
  const displayedRows = allData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <main className="bg-second h-full p-0.5">
      <div className="bg-box py-2 px-5 mb-0.5 h-[12%]">
        <h2 className="flex text-prime gap-5 items-center text-xl font-bold mt-3">
          <FaFingerprint size={40} />
          Bio Metric
        </h2>
      </div>

      <div className="bg-white h-[88%]  p-5">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-4">
            <button className="flex justify-center items-center text-xs rounded hover:rounded-full hover:border-red-200 hover:border bg-second p-2 font-semibold">
              <CiExport /> Export
            </button>
            <button className="flex justify-center items-center text-xs rounded hover:rounded-full hover:border-red-200 hover:border bg-second p-2 font-semibold">
              <CiFilter /> Filter
            </button>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={allData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": { padding: "10px", textAlign: "center" },
          }}
          aria-label="simple table"
          className="mt-2 text-center"
        >
          <TableHead>
            <TableRow>
              {headers.map((data, i) => (
                <TableCell
                  key={i}
                  style={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allData.map((data, i) => (
              <TableRow key={i}>
                {Object.values(data).map((val, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    size="10px"
                    className="border"
                    sx={{ fontSize: "12px", transform: "capitalize" }}
                  >
                    {val || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
      </div>
    </main>
  );
}

export default MmuDashboard;
