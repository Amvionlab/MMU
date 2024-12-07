import React, { useContext, useEffect, useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { baseURL } from "../../config.js";
import {
  Table, TableHead, TableBody, TableCell, TableContainer, TableRow,
  TablePagination, FormControl, OutlinedInput, MenuItem, Select, Checkbox, ListItemText,
  TableSortLabel, Button
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext/UserContext.jsx";
import { PieChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { format } from "date-fns";

// Function to group data by a specific field
const groupDataByField = (field, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { "No Data": 0 };
  }

  return data.reduce((acc, ticket) => {
    const value = ticket[field] || "Empty";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

const FILTER_FIELDS = [
  "bpartner_group", "business_partner", "prod_name", "state",
  "division", "territory", "rm", "buh", "vendor_name", "zone",
  "parameter_sap", "document", "aop_2024_mapping"
];

const SUMMARY_FIELDS = [
  "bpartner_group", "business_partner", "prod_name", "state",
  "division", "territory", "rm", "buh", "vendor_name", "zone"
];

const HEADERS = [
  "month", "Date Invoiced", "bpartner group", "business partner", "prod value",
  "prod name", "invoiced qty", "line amt", "sales_in_lacs", "product category", "product group",
  "state", "zone", "division", "am", "territory", "rm", "buh", "product mapping",
  "product type", "sap code", "product grouping", "vendor name", "parameter sap",
  "brand", "product division", "document", "revenue account", "cogs account",
  "year", "customer po num", "mapping code", "euroimmun top product", "pack size",
  "aop 2024 mapping", "territory 2023", "buh 2023"
];

// Debounce utility function
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function Reports() {
  const { user } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [page, setPage] = useState(0);
  const [ticketsPerPage, setTicketsPerPage] = useState(25);
  const [selectedFilter, setSelectedFilter] = useState("bpartner_group");
  const [selectedLabels, setSelectedLabels] = useState(FILTER_FIELDS.map(() => []));
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [totalLineAmt, setTotalLineAmt] = useState(0);
  const [totalSalesAmt, setTotalSalesAmt] = useState(0);
  const [totalInvoicedQty, setTotalInvoicedQty] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [availableFilters, setAvailableFilters] = useState({});
  const [chartData, setChartData] = useState([]);
  const [chartPage, setChartPage] = useState(0);
  const [summaryData, setSummaryData] = useState([]);

  const fetchTickets = () => {
    const queryString = `page=${page + 1}&limit=${ticketsPerPage}` +
      (user.accessId === "3" ? `&user=${user.userId}` : user.accessId === "5" ? `&support=${user.userId}` : "");
 
    const filters = selectedLabels.map((labels, index) => {
        const field = FILTER_FIELDS[index];
        if (labels.length > 0) {
            return `${field} IN (${labels.map(label => `"${label}"`).join(',')})`;
        }
        return null;
    }).filter(Boolean).join(' AND ');
  
    // Date range query generation
    const dateQuery = fromDate && toDate 
                      ? `(date_invoiced BETWEEN '${format(fromDate, 'yyyy-MM-dd')}' AND '${format(toDate, 'yyyy-MM-dd')}')` 
                      : '';
  
    // Constructing the filter query
    let filterQuery = '';
    if (filters.length > 0 && dateQuery) {
        // Both filters and date ranges are present
        filterQuery = `&filters=${encodeURIComponent(filters + ' AND ' + dateQuery)}`;
    } else if (filters.length > 0) {
        // Only filters are present
        filterQuery = `&filters=${encodeURIComponent(filters)}`;
    } else if (dateQuery) {
        // Only date query is present
        filterQuery = `&filters=${encodeURIComponent(dateQuery)}`;
    }
  
    console.log(filterQuery);
    fetch(`${baseURL}backend/fetchTickets.php?${queryString}${filterQuery}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.tickets) {
          setTickets(data.tickets);
          setTotalTickets(data.total);
        } else {
          setTickets([]);
          setTotalTickets(0);
        }
      })
      .catch(error => console.error("Error fetching ticket data:", error));
  };

const fetchChartData = () => {
  // Create filter conditions based on selectedLabels
  const filters = selectedLabels.map((labels, index) => {
      const field = FILTER_FIELDS[index];
      if (labels.length > 0) {
          return `${field} IN (${labels.map(label => `"${label}"`).join(',')})`;
      }
      return null;
  }).filter(Boolean).join(' AND ');

  // Date range query generation
  const dateQuery = fromDate && toDate 
                    ? `(date_invoiced BETWEEN '${format(fromDate, 'yyyy-MM-dd')}' AND '${format(toDate, 'yyyy-MM-dd')}')` 
                    : '';

  // Constructing the filter query
  let filterQuery = '';
  if (filters.length > 0 && dateQuery) {
      // Both filters and date ranges are present
      filterQuery = `&filters=${encodeURIComponent(filters + ' AND ' + dateQuery)}`;
  } else if (filters.length > 0) {
      // Only filters are present
      filterQuery = `&filters=${encodeURIComponent(filters)}`;
  } else if (dateQuery) {
      // Only date query is present
      filterQuery = `&filters=${encodeURIComponent(dateQuery)}`;
  }

  // Fetching chart data
  fetch(`${baseURL}backend/fetchChartData.php?field=${selectedFilter}${filterQuery}`)
    .then(response => response.json())
    .then(data => {
        setChartData(data.chartData);
        const { total_invoiced_qty, total_line_amt, total_sales_in_lacs, total_pack_size } = data.sums || {};
        setSummaryData([
            { label: "Total Invoiced Qty", value: total_invoiced_qty },
            { label: "Total Line Amount", value: total_line_amt },
            { label: "Total Sales in Lacs", value: total_sales_in_lacs },
            { label: "Total Pack Size", value: total_pack_size }
        ]);
    })
    .catch(error => console.error("Error fetching chart data:", error));
};

// debounce function to optimize fetch requests
const debouncedFetch = debounce(() => {
fetchChartData();
fetchTickets();
}, 300);

useEffect(() => {
debouncedFetch();
}, [page, ticketsPerPage, selectedLabels, fromDate, toDate, selectedFilter]);

// Load filter options
useEffect(() => {
const fetchAllFilterOptions = async () => {
  for (const field of FILTER_FIELDS) {
    try {
      const response = await fetch(`${baseURL}backend/fetchFilterOptions.php?field=${field}`);
      const data = await response.json();
      setAvailableFilters((prev) => ({ ...prev, [field]: data.options }));
    } catch (error) {
      console.error(`Error fetching filter options for ${field}:`, error);
    }
  }
};
fetchAllFilterOptions();
}, []);

const handleFilterChange = (index) => (event) => {
const { target: { value } } = event;
setSelectedLabels((prev) => {
  const updated = [...prev];
  updated[index] = typeof value === "string" ? value.split(",") : value;
  return updated;
});
};

const handleSubmit = () => {
// Trigger fetch when submit button is pressed
fetchTickets();
};

const domainData = useMemo(() => groupDataByField(selectedFilter, tickets), [selectedFilter, tickets]);

const pieChartData = useMemo(() => {
return chartData.map(item => {
  const label = item[selectedFilter] || 'Unknown';
  return {
    label: label.length > 9 ? label.slice(0, 8) + '...' : label,
    value: item.count || 0,
  };
}).slice(chartPage * 8, chartPage * 8 + 8);
}, [chartData, selectedFilter, chartPage]);

const barChartData = useMemo(() => {
  const labels = chartData.map(item => item[selectedFilter]).slice(chartPage * 8, chartPage * 8 + 8);
  const values = chartData.map(item => item.salessum).slice(chartPage * 8, chartPage * 8 + 8);
  return { labels, values };
}, [chartData, selectedFilter, chartPage]);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const sortedTickets = useMemo(() => {
  return [...tickets].sort(getComparator(order, orderBy));
}, [tickets, order, orderBy]);

const handleRequestSort = (property) => {
  const isAsc = orderBy === property && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(property);
};

const handlePageChange = (event, newPage) => {
  // Immediately set the new page state
  setPage(newPage);
  // Fetch tickets using the updated page
  fetchTickets(newPage);
};

const handleRowsPerPageChange = (event) => {
  setTicketsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Go back to the first page when changing limit
  fetchTickets(); // Fetch tickets for the new limit and the first page
};

const handleChartPageChange = (event, newPage) => setChartPage(newPage); // Unified page change handler

const csvData = useMemo(() => tickets.map((ticket) => ({
  Id: ticket.id,
  Type: ticket.type,
  SLA: ticket.sla,
  Status: ticket.status,
  Service: ticket.service,
  Department: ticket.department,
  Assignees: ticket.assignees,
  Domain: ticket.domain,
  SubDomain: ticket.subdomain,
  Customer: ticket.customer,
  "Created At": ticket.post_date,
  "Created By": ticket.name,
  "Closed At": ticket.closed_date,
})), [tickets]);

const updatedHeaders = HEADERS.map((header) =>
  header === "line amt"
    ? `line amt (Total: ${(totalLineAmt || 0).toFixed(2)})`
    : header === "invoiced qty"
    ? `invoiced qty (Total: ${(totalInvoicedQty || 0).toFixed(2)})`
    : header === "sales_in_lacs"
    ? `sales_in_lacs (Total: ${(totalSalesAmt || 0).toFixed(2)})`
    : header
);

return (
  <div className="flex h-full bg-second p-0.5 gap-0.5 font-serif">
    <div className="w-[12.5%] sticky top-0 h-full rounded bg-box p-2 overflow-y-auto">
      
      {selectedLabels.map((selectedLabel, index) => (
        FILTER_FIELDS[index] !== "date_invoiced" && (
          <FormControl key={index} sx={{ my: 0.5, width: "100%" }} size="small">
            <Select
              multiple
              value={selectedLabel}
              onChange={handleFilterChange(index)}
              displayEmpty
              input={<OutlinedInput />}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  <span style={{ color: "#aaa" }}>{FILTER_FIELDS[index]}</span>
                ) : selected.join(", ")
              }
              sx={{
                fontSize: "0.75rem",
                padding: "16px",
                height: "30px",
                "& .MuiSelect-select": {
                  minHeight: "1.25rem",
                  padding: "5px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 30 * 4.5 + 2, width: 200 },
                },
              }}
            >
              {(availableFilters[FILTER_FIELDS[index]] || []).map((label) => (
                <MenuItem key={label} value={label}>
                  <Checkbox checked={selectedLabel.includes(label)} size="small" />
                  <ListItemText primary={label} sx={{ fontSize: "0.8rem" }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      ))}
    </div>

    <div className="w-[87.5%] overflow-auto">
      <div className="flex h-[10%] gap-0.5 mb-0.5 bg-second">
        <div className="grid grid-cols-4 gap-0.5 w-full font-mono">
          {summaryData.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center bg-white">
              <div className="font-bold text-sm text-prime">{item.label}</div>
              <div className="font-semibold text-xs">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-box p-2 text-center ">
        <div className="text-xs font-bold flex text-nowrap mb-2">
        <label>From &nbsp;:</label>
        <DatePicker  className="bg-second px-2 py-0.5 rounded w-[80%] placeholder:text-prime  text-prime cursor-pointer"
          selected={fromDate}
          onChange={(date) => {
            setFromDate(date);
            if (!toDate || date > toDate) setToDate(date); // Match endDate to startDate if endDate is null or before startDate
          }}
          selectsStart
          startDate={fromDate}
          placeholderText="yyyy-mm-dd"
          endDate={toDate}
          dateFormat="yyyy-MM-dd"
          isClearable
        />
      </div>
      <div className="text-xs font-bold flex text-nowrap">
        <label>To&emsp;&emsp;:</label>
        <DatePicker className="bg-second px-2 rounded  py-0.5 w-[80%] placeholder:text-prime  text-prime cursor-pointer"
          selected={toDate}
          onChange={(date) => setToDate(date)}
          selectsEnd
          placeholderText="yyyy-mm-dd"
          startDate={fromDate}
          endDate={toDate}
          minDate={fromDate}
          dateFormat="yyyy-MM-dd"
          isClearable
        />
      </div>

    
      </div>
      </div>

      <div className="flex h-[55%] gap-0.5 mb-0.5">
        <div className="w-[15%] bg-box p-3 rounded gap-1">
          <p className="font-bold text-sm font-serif m-1 mb-2 text-center">Charts By</p>
          {SUMMARY_FIELDS.map((item) => (
            <div
              key={item}
              onClick={() => setSelectedFilter(item.toLowerCase())}
              className={`py-1 px-2 w-[95%] text-xs break-words flex grid-cols-1 font-medium rounded cursor-pointer m-1 ${
                item.toLowerCase() === selectedFilter
                  ? "bg-prime text-white"
                  : "bg-box text-black border border-black"
              }`}
            >
              <p className="capitalize text-nowrap">{item.replaceAll("_", " ")}</p>
            </div>
          ))}
        </div>

        <div className="w-[42.5%] bg-box p-2 rounded">
          <PieChart
            series={[
              {
                data: pieChartData,
                innerRadius: 30,
                outerRadius: 90,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 28,
                  additionalRadius: 0,
                  color: "gray",
                },
                plugins: [
                  {
                    name: "legend",
                    options: {
                      labels: {
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                ],
              },
            ]}
            height={280}
            width={400}
          />

          <TablePagination
            component="div"
            count={chartData.length}
            page={chartPage}
            onPageChange={handleChartPageChange}
            rowsPerPage={8}
          />
        </div>

        <div className="w-[42.5%] bg-box p-2 rounded">
          <BarChart
            xAxis={[{ scaleType: "band", data: barChartData.labels }]}
            series={[{ data: barChartData.values }]}
            width={425}
            height={300}
          />
        </div>
      </div>

      <div className="bg-box p-2 rounded h-auto">
        <div className="w-full border-b h-10 flex text-sm justify-between items-center font-medium mb-2">
          <div className="flex capitalize ml-1 mt-3 text-base">
            <p className="font-bold text-prime">Analytics</p>
          </div>
          <TablePagination
            component="div"
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: "10px" },
              "& .MuiTablePagination-actions": { fontSize: "10px" },
              minHeight: "30px",
              ".MuiTablePagination-toolbar": { minHeight: "30px", padding: "0 8px" },
            }}
            count={totalTickets}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={ticketsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </div>

        <TableContainer sx={{ maxHeight: "calc(120vh - 200px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#01AB86" }}>
                {updatedHeaders.map((header, index) => (
                  <TableCell key={index}
                    align={["line amt", "invoiced qty"].includes(header) ? "center" : "left"}
                    sx={{
                      whiteSpace: "nowrap",
                      fontWeight: "300",
                      fontSize: "14px",
                      padding: "1px 3px",
                      backgroundColor: "#01AB86",
                      color: "white",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === header.toLowerCase().replace(/\s/g, "_")}
                      direction={orderBy === header.toLowerCase().replace(/\s/g, "_") ? order : "asc"}
                      onClick={() => handleRequestSort(header.toLowerCase().replace(/\s/g, "_"))}
                      sx={{
                        "&.Mui-active": { color: "white" },
                        "&:hover": { color: "white" },
                        "& .MuiTableSortLabel-icon": { color: "white !important" },
                      }}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTickets.length === 0 ? (
                <TableRow hover>
                  <TableCell colSpan={HEADERS.length} sx={{ padding: "2px 4px", fontSize: "10px", textAlign: "center" }}>
                    No tickets available
                  </TableCell>
                </TableRow>
              ) : (
                sortedTickets
                  .map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      {HEADERS.map((header, index) => (
                        <TableCell
                          key={index}
                          align={["line amt", "invoiced qty"].includes(header) ? "center" : "left"}
                          sx={{
                            padding: "2px 4px",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                        >
                          {["prod name", "business partner", "customer po num"].includes(header)
                            ? ticket[header.toLowerCase().replace(/\s/g, "_")]
                                ?.split(" ")
                                .slice(0, 3)
                                .join(" ") + (ticket[header.toLowerCase().replace(/\s/g, "_")]?.split(" ").length > 3 ? "..." : "")
                            : ticket[header.toLowerCase().replace(/\s/g, "_")]
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  </div>
);
}

export default Reports;