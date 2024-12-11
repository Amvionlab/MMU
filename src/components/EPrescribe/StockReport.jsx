import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

const StockReport = () => {
  const [stockPage, setStockPage] = useState(0);
  const [stockRowsPerPage, setStockRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const dummyStockData = [
    { productName: 'Product 1', quantitySold: 20, currentStock: 50 },
    { productName: 'Product 2', quantitySold: 15, currentStock: 30 },
    { productName: 'Product 3', quantitySold: 10, currentStock: 20 },
  ];

  const filteredStockData = dummyStockData.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStockData = filteredStockData.slice(stockPage * stockRowsPerPage, stockPage * stockRowsPerPage + stockRowsPerPage);

  return (
    <>
      <div>
        <label>Search Product:</label>
        <input
          type="text"
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Enter a product name"
        />
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredStockData.length}
        rowsPerPage={stockRowsPerPage}
        page={stockPage}
        onPageChange={(event, newPage) => setStockPage(newPage)}
        onRowsPerPageChange={event => {
          setStockRowsPerPage(parseInt(event.target.value, 10));
          setStockPage(0);
        }}
      />
      <Table sx={{ minWidth: 650 }} aria-label="Stock Report" className="mt-4">
        <TableHead>
          <TableRow>
          <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Quantity Sold</TableCell>
            <TableCell style={{ fontWeight: "600", fontSize: "1rem" }}>Current Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedStockData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.productName}</TableCell>
              <TableCell>{row.quantitySold}</TableCell>
              <TableCell>{row.currentStock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default StockReport;