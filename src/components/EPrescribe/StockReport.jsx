import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

const StockReport = () => {
  const [stockPage, setStockPage] = useState(0);
  const [stockRowsPerPage, setStockRowsPerPage] = useState(10);
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
    <div className="bg-box h-auto">
      <div className="flex items-center justify-between bg-box border-b text-xs mb-2">
        <div className="flex items-center">
          <label className="font-semibold text-red-600">Search Product:</label>
          <input
            type="text"
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Enter a product name"
            className="border px-1 py-0.5 ml-2"
          />
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredStockData.length}
          page={stockPage}
          rowsPerPage={stockRowsPerPage}
          onPageChange={(event, newPage) => setStockPage(newPage)}
          onRowsPerPageChange={event => {
            setStockRowsPerPage(parseInt(event.target.value, 10));
            setStockPage(0);
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

      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Stock Report" className="mt-2 bg-box">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Product Name</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Quantity Sold</TableCell>
              <TableCell style={{ fontWeight: "600", fontSize: "14px", padding: "10px" }}>Current Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedStockData.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.productName}</TableCell>
                <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.quantitySold}</TableCell>
                <TableCell style={{ fontWeight: "400", fontSize: "12px", padding: "10px" }}>{row.currentStock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockReport;