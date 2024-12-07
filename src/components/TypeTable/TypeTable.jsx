import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { UserContext } from "../UserContext/UserContext";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { baseURL } from "../../config.js";
import Barcode from "react-barcode";
import { toast } from 'react-toastify';

function TypeTable() {
  const { type, group } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [allData, setAllData] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [substatuses, setSubStatuses] = useState([]);
  const [toStatus, setTostatus] = useState('');
  const [toSubstatus, setTosubstatus] = useState('');
  const [inactiveColumns, setInactiveColumns] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [anchorElRemove, setAnchorElRemove] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [toLocation, setToLocation] = useState('');
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newNote, setNewNote] = useState('');
  const { user } = useContext(UserContext);
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState([]);
  const [substatus, setSubstatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        if (data) {
          setBranches(data.branches || []);
          setStatus(data.statuses || []);
          setSubstatus(data.substatuses || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

console.log(branches);
console.log(status);
console.log(substatus);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const togglePopup1 = () => {
    setShowPopup1(!showPopup1);
  };
  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

const handleAddNote = (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    const selectedTags = selectedRows.map(index => sortedData()[index].tag);

    const noteData = {
      tags: selectedTags,
      notes: newNote,
      toLocation: toLocation,
      user: user.firstname
    };
    console.log(noteData)
    fetch(`${baseURL}/backend/fetchTransfer.php?action=multiadd&type=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        setToLocation('');
        togglePopup();
        toast.success("Transfer Request Added");
        setSelectedRows([]);
      } else {
        console.error('Failed to add note:', result.error);
      }
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
    
  };

  const handleAddNote1 = (e) => {
    e.preventDefault();
  
    const selectedTags = selectedRows.map(index => sortedData()[index].tag);

    const noteData1 = {
      tags: selectedTags,
      status: toStatus,
      substatus: toSubstatus,
      user: user.firstname
    };
    console.log(noteData1);
    fetch(`${baseURL}/backend/fetchTransfer.php?action=status&type=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData1),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        setTostatus('');
        setTosubstatus('');
        togglePopup1();
        toast.success("Status Changed");
        setSelectedRows([]);
        fetchData();
      } else {
        console.error('Failed to change:', result.error);
      }
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
  };


  const fetchData = async () => {
    try {
      const fieldsResponse = await fetch(
        `${baseURL}/backend/fetchTableFields.php?type=${type}`
      );
      const fieldData = await fieldsResponse.json();
      setAllData(fieldData);
      setInactiveColumns(fieldData.inactive_columns || []);
      setColumns(fieldData.active_columns || []);
  
      let typeResponse;
      if (user.area === '1') {
        typeResponse = await fetch(
          `${baseURL}/backend/fetchTypedata.php?type=${type}`
        );
      } else if (user.area === '2') {
        typeResponse = await fetch(
          `${baseURL}/backend/fetchTypedata.php?type=${type}&location=${user.location}`
        );
      } else if (user.area === '3') {
        typeResponse = await fetch(
          `${baseURL}/backend/fetchTypedata.php?type=${type}&branch=${user.branch}`
        );
      }
  
      const typedata = await typeResponse.json();
      setTypeData(typedata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {

    fetchData();
  }, [type]);

  useEffect(() => {
    const filtered =
      selectedColumn === "" || selectedColumn === "All"
        ? typeData.filter((item) =>
            Object.values(item).some((value) =>
              value?.toString().toLowerCase().includes(filterText.toLowerCase())
            )
          )
        : typeData.filter((item) =>
            item[selectedColumn]
              ?.toString()
              .toLowerCase()
              .includes(filterText.toLowerCase())
          );

    setFilteredData(filtered);
  }, [selectedColumn, filterText, typeData]);

  const [locations, setLocations] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        setLocations(data.branches);
        setStatuses(data.statuses);
        setSubStatuses(data.substatuses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const sortedData = () => {
    return filteredData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
  //const filteredLocations = locations.filter(location => location.name !== detdata.location); 
 
  const toggleColumnStatus = async (columnId, action) => {
    try {
      const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
      url.searchParams.append("id", columnId);
      url.searchParams.append("act", action);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await response.json();
      if (data.success) {
        const fieldsResponse = await fetch(
          `${baseURL}/backend/fetchTableFields.php?type=${type}`
        );
        const fieldData = await fieldsResponse.json();
        setAllData(fieldData);
        setInactiveColumns(fieldData.inactive_columns || []);
      }
    } catch (error) {
      console.error("There was an error:", error);
    }
  };

  const handleAddColumn = (columnId) => {
    toggleColumnStatus(columnId, "add");
    setAnchorElAdd(null);
  };

  const handleRemoveColumn = (columnId) => {
    toggleColumnStatus(columnId, "remove");
    setAnchorElRemove(null);
  };

  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked
      ? sortedData()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((_, index) => index + page * rowsPerPage)
      : [];
    setSelectedRows(newSelecteds);
  };

  const toggleRowSelection = (rowIndex) => {
    setSelectedRows(prev => 
      prev.includes(rowIndex)
        ? prev.filter(id => id !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedRows([]); 
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      ...columns.map((col) => col.column_name.replace("_", " ")),
    ];
    const rows = filteredData.map((row, index) => [
      index + 1,
      ...columns.map((col) => row[col.column_name] || "-"),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${type}_data.csv`);
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };

  const filteredsubstatuses = substatuses.filter(
    (substatus) => substatus.status_id === toStatus
  );
  const handlePrintBarcodes = () => {
    const selectedTags = selectedRows.map(index => sortedData()[index].tag);
    console.log(selectedTags)

    if (selectedTags.length > 0) {
      const printWindow = window.open("", "", "height=600,width=800");
      printWindow.document.write("<html><head><title>Print Barcodes</title></head><body>");
      selectedTags.forEach(tag => {
        printWindow.document.write(`<div style="margin: 20px; text-align: center;">`);
        printWindow.document.write(`<div>Tag: ${tag}</div>`);
        printWindow.document.write(`<div><img src="https://barcode.tec-it.com/barcode.ashx?data=${tag}&code=Code128" alt="Barcode for ${tag}" /></div>`);
        printWindow.document.write(`</div>`);
      });
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  
  if (!allData || !allData.active_columns) {
    return <p className="text-center text-red-600">Loading...</p>;
  }

  const columnsToShow = allData.active_columns.filter(
    (column) => column.type === type
  );


  const getNameById = (id, list) => {
    const item = list.find(element => element.id === id);
    return item ? item.name : '-';
  };

  return (
    <div className="lg:flex p-1 gap-4 w-full h-full lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="w-full bg-white p-1 rounded-md h-full flex flex-col">
        <div className="w-full border-b h-10 flex text-sm justify-between items-center font-semibold mb-2">
          <div className="flex capitalize ml-4">
            <Link
              to={`/management/${group}`}
              className="text-flo hover:underline capitalize"
            >
              {group}
            </Link>
            <p>&nbsp; / {type}</p>
          </div>

          <div className="flex gap-1 items-center">
          {selectedRows.length > 0 && (
            <div className="gap-2 flex">
            <button
              onClick={handlePrintBarcodes}
              className="px-2 py-1 bg-flo border-flo hover:bg-box hover:text-flo text-box font-bold rounded border text-xs shadow-sm transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              Barcode
            </button>

            <button
              onClick={togglePopup}
              className="px-2 py-1 bg-flo border-flo  hover:bg-box hover:text-flo text-box font-bold rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              Transfer
            </button>
            <button
              onClick={togglePopup1}
              className="px-2 py-1 bg-flo border-flo hover:bg-box text-box hover:text-flo font-bold rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              Status
            </button>
            </div>
          )}
          {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-2/6">
            <h2 className="text-xl font-semibold mb-4">New Transfer</h2>
            <form onSubmit={handleAddNote}>
              <div className='flex gap-4'>
                
                <div className="mb-4 w-full gap-2">
                  <label className="mb-1">To</label>
                  <select
                    //value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                  >
                    <option value="">Select Location</option>
                    {branches.map((location) => (
                      <option key={location} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
              <label className="mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-prime"
                  rows="4"
                  placeholder="Enter description here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                />
              </div>
             
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={togglePopup}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-prime text-white px-4 py-2 rounded-md"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


{showPopup1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-2/6">
            <h2 className="text-xl font-semibold mb-4">Change Status</h2>
            <form onSubmit={handleAddNote1}>
              <div className='flex gap-4'>
                <div className="mb-4 w-1/2">
                  <label>Status</label>
                  <select
                    //value={detdata.location}
                    onChange={(e) => setTostatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                    >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4 w-1/2 gap-2">
                  <label>Sub Status</label>
                  <select
                    //value={toLocation}
                    onChange={(e) => setTosubstatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                  >
                    <option value="" disabled>Select Sub Status</option>
                    {filteredsubstatuses.map((substatus) => (
                      <option key={substatus.id} value={substatus.id}>
                        {substatus.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                           
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={togglePopup1}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-prime text-white px-4 py-2 rounded-md"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
            <TablePagination
              className="compact-pagination"
              rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

          <div className="flex gap-1">
            <select
              className="border rounded text-xs capitalize"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="All">All</option>
              {columns.map((column) => (
                <option key={column.id} value={column.column_name}>
                  {column.column_name.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter text"
              className="border rounded p-1 text-xs"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setFilterText(e.target.value);
              }}
            />
          </div>

          <div className="flex gap-1">
            <button
              onClick={exportToCSV}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              CSV
            </button>
          </div>

          <div className="flex gap-2 mr-4">
            <button
              onClick={(e) => setAnchorElAdd(e.currentTarget)}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              onClick={(e) => setAnchorElRemove(e.currentTarget)}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>

        <TableContainer sx={{ maxHeight: "calc(100vh - 100px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ padding: "1px", fontSize: "10px" }}
                >
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < typeData.length
                    }
                    checked={
                      selectedRows.length ===
                      typeData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 50, fontWeight: "bold" }}
                >
                  <button onClick={() => handleRequestSort("id")}>ID</button>
                </TableCell>
                {columnsToShow.map((column, index) => (
                  <TableCell
                    className="capitalize text-nowrap"
                    key={index}
                    align="center"
                    style={{ minWidth: 120, fontWeight: "bold" }}
                    onClick={() => handleRequestSort(column.column_name)}
                  >
                    {column.column_name.replace("_", " ")}{" "}
                    {orderBy === column.column_name
                      ? order === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={rowIndex}
                    selected={selectedRows.includes(rowIndex)}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{ padding: "1px", fontSize: "10px" }}
                    >
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ padding: "2px", fontSize: "12px" }}
                    >
                      <Link
                        to={`/inventory/${group}/${type}/${row.tag}`}
                        className="text-flo hover:underline capitalize"
                      >
                        {rowIndex + 1}
                      </Link>
                    </TableCell>

                    {columnsToShow.map((column, colIndex) => {
              const columnValue = row[column.column_name];

              // Check if the current column is of type branch, status, or substatus
              let displayValue = columnValue || "-";
              if (column.column_name === "branch") {
                displayValue = getNameById(columnValue, branches);
              } else if (column.column_name === "status") {
                displayValue = getNameById(columnValue, statuses);
              } else if (column.column_name === "sub_status") {
                displayValue = getNameById(columnValue, substatuses);
              }

              return (
                <TableCell
                  align="center"
                  key={colIndex}
                  sx={{ padding: "1px", fontSize: "12px" }}
                >
                  {displayValue}
                </TableCell>
              );
            })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorElAdd}
          open={Boolean(anchorElAdd)}
          onClose={() => setAnchorElAdd(null)}
        >
          {inactiveColumns.length > 0 ? (
            inactiveColumns.map((column) => (
              <MenuItem
                className="capitalize"
                key={column.id}
                onClick={() => handleAddColumn(column.id)}
              >
                {column.column_name.replace("_", " ")}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nothing</MenuItem>
          )}
        </Menu>

        <Menu
          anchorEl={anchorElRemove}
          open={Boolean(anchorElRemove)}
          onClose={() => setAnchorElRemove(null)}
        >
          {columnsToShow.length > 0 ? (
            columnsToShow.map((column) => (
              <MenuItem
                className="capitalize"
                key={column.id}
                onClick={() => handleRemoveColumn(column.id)}
              >
                {column.column_name.replace("_", " ")}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nothing</MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
}

export default TypeTable;
