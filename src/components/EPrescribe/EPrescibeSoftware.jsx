import React, { useEffect, useState } from "react";
import { CiExport, CiFilter } from "react-icons/ci";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";

const headers = {
  rows: ["ID", "Last Name", "First Name", "Age"],
  medicineData: [
    "S.No",
    "Medicine Name",
    "Category",
    "Units",
    "Total Stock",
    "Sold",
    "Generic",
    "Manufacturer",
  ],
  customers: [
    "Serial No",
    "Name",
    "Reg Number",
    "Mobile",
    "Age",
    "Gender",
    "Provisional Diagnosis",
    "Investigations",
    "Final Diagnosis",
    "Treatment",
    "Result",
    "Additional Info",
    "Medical Officer Initial",
  ],
};
const customers = [
  {
    SerialNo: 1,
    Name: "Thilagan",
    RegNumber: "RH22000003",
    Mobile: "8754458333",
    Age: "25 Y 9 M 30 D",
    Gender: "Male",
    ProvisionalDiagnosis: "Fever",
    Investigations: "LDL Cholesterol, X-RAY ANKLE AP /LAT Charges",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 2,
    Name: "Senthilkumar",
    RegNumber: "RH23000100",
    Mobile: "1000002091",
    Age: "49 Y 9 M 23 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 3,
    Name: "Senthilkumar",
    RegNumber: "RH23000100",
    Mobile: "1000002091",
    Age: "49 Y 9 M 23 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 4,
    Name: "Senthilkumar",
    RegNumber: "RH23000100",
    Mobile: "1000002091",
    Age: "49 Y 9 M 23 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 5,
    Name: "Senthilkumar",
    RegNumber: "RH23000100",
    Mobile: "1000002091",
    Age: "49 Y 9 M 23 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 6,
    Name: "Arun",
    RegNumber: "RH24000422",
    Mobile: "1122334455",
    Age: "25 Y 0 M 18 D",
    Gender: "Male",
    ProvisionalDiagnosis: "Fever",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 7,
    Name: "Thilagan",
    RegNumber: "RH22000003",
    Mobile: "8754458333",
    Age: "25 Y 9 M 30 D",
    Gender: "Male",
    ProvisionalDiagnosis: "Fever",
    Investigations: "Ezovion Health Package, USG COMPLETE ABDOMEN",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 8,
    Name: "Bhavin",
    RegNumber: "RH24000430",
    Mobile: "5566778788",
    Age: "43 Y 0 M 11 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 9,
    Name: "Priyanka",
    RegNumber: "RH24000432",
    Mobile: "5544467777",
    Age: "56 Y 0 M 11 D",
    Gender: "Female",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 10,
    Name: "Tej",
    RegNumber: "RH24000433",
    Mobile: "3494839834",
    Age: "33 Y 0 M 11 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 11,
    Name: "Misri",
    RegNumber: "RH24000434",
    Mobile: "4874549494",
    Age: "54 Y 0 M 11 D",
    Gender: "Female",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 12,
    Name: "Payal",
    RegNumber: "RH24000435",
    Mobile: "3383993993",
    Age: "33 Y 0 M 11 D",
    Gender: "Female",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 13,
    Name: "Ranjan",
    RegNumber: "RH22000004",
    Mobile: "8888111111",
    Age: "36 Y 11 M 26 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
  {
    SerialNo: 15,
    Name: "Thilagan",
    RegNumber: "RH22000003",
    Mobile: "8754458333",
    Age: "25 Y 9 M 30 D",
    Gender: "Male",
    ProvisionalDiagnosis: "-",
    Investigations: "-",
    FinalDiagnosis: "-",
    Treatment: "-",
    Result: "-",
    AdditionalInfo: "-",
    MedicalOfficerInitial: "-",
  },
];
const medicineData = [
  {
    SNo: 1,
    MedicineName: "2 - SIRONIX ORTHO FIX FIBER",
    MedicineCategory: "SURGICAL",
    Units: 1,
    TotalStock: 221,
    Sold: 1,
    Generic: "Other Generic",
    Manufacturer: "Manufacturer Not Mentioned",
  },
  {
    SNo: 2,
    MedicineName: "Agmacet 10mg Tablet",
    MedicineCategory: "TABLETS",
    Units: 10,
    TotalStock: 311,
    Sold: 11,
    Generic: "Cetirizine",
    Manufacturer: "Aamorb Pharmaceuitcals Pvt.Ltd",
  },
  // Additional rows...
];

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
];

function EPrescibeSoftware() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState("rows");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [title, setTitle] = useState("Medicine Report");

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
  const getDataForSelectedTable = () => {
    {
      switch (selectedTable) {
        case "medicineData":
          return medicineData;
        case "customers":
          return customers;
        default:
          return rows;
      }
    }
  };
  // Calculate displayed rows

  const paginatedRows = getDataForSelectedTable().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <main className="bg-white h-full p-8">
      <div className="flex gap-5 ">
        <p
          className={`p-2 bg-slate-300 rounded-lg cursor-pointer capitalize ${
            selectedTable == "rows" && "bg-slate-600 text-white"
          }`}
          onClick={() => {
            setSelectedTable("rows"), setTitle("Medicine Report");
          }}
        >
          Button1
        </p>
        <p
          className={`p-2 bg-slate-300 rounded-lg cursor-pointer capitalize ${
            selectedTable == "medicineData" && "bg-slate-600 text-white"
          }`}
          onClick={() => {
            setSelectedTable("medicineData"),
              setTitle("Product Sold vs Current Stock Report");
          }}
        >
          medicineData
        </p>
        <p
          className={`p-2 bg-slate-300 rounded-lg cursor-pointer capitalize ${
            selectedTable == "customers" && "bg-slate-600 text-white"
          }`}
          onClick={() => {
            setSelectedTable("customers"),
              setTitle("CEA-Form-III-Part-D-PatientsRegister");
          }}
        >
          Patients
        </p>
      </div>
      <section>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-2xl font-mont p-2 mt-2">{title}</h2>
          </div>
          <div className="flex  items-center gap-4 p-2 py-5">
            <div>
              <label htmlFor="fromdate" className="font-medium">
                From
              </label>{" "}
              &nbsp;
              <input
                type="date"
                name="from"
                id="from"
                className="border border-black p-1 rounded-sm text-sm"
              />
            </div>
            <div>
              <label htmlFor="fromdate" className="font-medium">
                To
              </label>{" "}
              &nbsp;
              <input
                type="date"
                name="to"
                id="to"
                className="border border-black p-1 rounded-sm text-sm"
              />
            </div>
            <div>
              <label htmlFor="branch" className="font-medium">
                Branch
              </label>{" "}
              &nbsp;
              <select
                name="branch"
                id="branch"
                className="border border-black p-1 rounded-sm text-sm"
              >
                <option value="">select branch</option>
                <option value="">Branch1</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="font-medium">
                Location
              </label>{" "}
              &nbsp;
              <select
                name="branch"
                id="branch"
                className="border border-black p-1 rounded-sm text-sm"
              >
                <option value="">select location</option>
                <option value="">location1</option>
              </select>
            </div>
            <div>
              <label htmlFor="medicine" className="font-medium">
                Medicine
              </label>{" "}
              &nbsp;
              <input
                type="text"
                name="medicine"
                id="medicine"
                className="border border-black p-1 rounded-sm text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={paginatedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <TableContainer className=" shadow-lg rounded-lg">
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": { padding: "4px" },
              border: "1px",
            }}
            aria-label="simple table"
            className="mt-4"
          >
            <TableHead>
              <TableRow>
                {headers[selectedTable].map((header, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    className="border"
                    sx={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {" "}
              {paginatedRows.map((data, index) => (
                <TableRow key={index}>
                  {Object.values(data).map((value, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      size="10px"
                      className="border"
                      sx={{ fontSize: "12px" }}
                    >
                      {value || "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
      </section>
    </main>
  );
}

export default EPrescibeSoftware;
