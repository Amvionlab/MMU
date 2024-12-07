


import React, { useContext, useEffect, useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { baseURL } from "../../config.js";
import {
  Table, TableHead, TableBody, TableCell, TableContainer, TableRow,
  TablePagination, FormControl, OutlinedInput, MenuItem, Select, Checkbox, ListItemText,
  TableSortLabel
} from "@mui/material";
import { UserContext } from "../UserContext/UserContext.jsx";
import { PieChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";


const FILTER_FIELDS = [
  "Year", "division", "territory", "buh", "rm", "am name"
];

const SUMMARY_FIELDS = [
  "Year", "division", "territory", "buh", "rm", "am name"
];

const HEADERS = [
  "Year", "division", "territory", "buh", "rm", "am name", "prev ins act", "prev reag act", "prev yr total", 
  "ins tgt", "ins act", "ins ach per", "ins growth per", "reag tgt", "reag ach", "reag ach per", "reag growth per", 
  "curr yr total tgt", "curr yr total ach", "curr yr total ach per", "curr yr growth per", 
  "Jan_Ins_LYS", "Jan_Ins_Tgt", "Jan_Ins_Act", "Jan_Ins_Act_Per", "Jan_Ins_Growth_Per", 
  "Jan_Reag_LYS", "Jan_Reag_Tgt", "Jan_Reag_Act", "Jan_Reag_Act_Per", "Jan_Reag_Growth_Per", 
  "Jan Total LYS", "Jan Total Tgt", "Jan Total Act", "Jan Ach Per", "Jan Growth Per", 
  "Feb_Ins_LYS", "Feb_Ins_Tgt", "Feb_Ins_Act", "Feb_Ins_Act_Per", "Feb_Ins_Growth_Per", 
  "Feb_Reag_LYS", "Feb_Reag_Tgt", "Feb_Reag_Act", "Feb_Reag_Act_Per", "Feb_Reag_Growth_Per", 
  "Feb Total LYS", "Feb Total Tgt", "Feb Total Act", "Feb Ach Per", "Feb Growth Per", 
  "Mar_Ins_LYS", "Mar_Ins_Tgt", "Mar_Ins_Act", "Mar_Ins_Act_Per", "Mar_Ins_Growth_Per", 
  "Mar_Reag_LYS", "Mar_Reag_Tgt", "Mar_Reag_Act", "Mar_Reag_Act_Per", "Mar_Reag_Growth_Per", 
  "Mar Total LYS", "Mar Total Tgt", "Mar Total Act", "Mar Ach Per", "Mar Growth Per", 
  "Apr_Ins_LYS", "Apr_Ins_Tgt", "Apr_Ins_Act", "Apr_Ins_Act_Per", "Apr_Ins_Growth_Per", 
  "Apr_Reag_LYS", "Apr_Reag_Tgt", "Apr_Reag_Act", "Apr_Reag_Act_Per", "Apr_Reag_Growth_Per", 
  "Apr Total LYS", "Apr Total Tgt", "Apr Total Act", "Apr Ach Per", "Apr Growth Per", 
  "May_Ins_LYS", "May_Ins_Tgt", "May_Ins_Act", "May_Ins_Act_Per", "May_Ins_Growth_Per", 
  "May_Reag_LYS", "May_Reag_Tgt", "May_Reag_Act", "May_Reag_Act_Per", "May_Reag_Growth_Per", 
  "May Total LYS", "May Total Tgt", "May Total Act", "May Ach Per", "May Growth Per", 
  "Jun_Ins_LYS", "Jun_Ins_Tgt", "Jun_Ins_Act", "Jun_Ins_Act_Per", "Jun_Ins_Growth_Per", 
  "Jun_Reag_LYS", "Jun_Reag_Tgt", "Jun_Reag_Act", "Jun_Reag_Act_Per", "Jun_Reag_Growth_Per", 
  "Jun Total LYS", "Jun Total Tgt", "Jun Total Act", "Jun Ach Per", "Jun Growth Per", 
  "Jul_Ins_LYS", "Jul_Ins_Tgt", "Jul_Ins_Act", "Jul_Ins_Act_Per", "Jul_Ins_Growth_Per", 
  "Jul_Reag_LYS", "Jul_Reag_Tgt", "Jul_Reag_Act", "Jul_Reag_Act_Per", "Jul_Reag_Growth_Per", 
  "Jul Total LYS", "Jul Total Tgt", "Jul Total Act", "Jul Ach Per", "Jul Growth Per", 
  "Aug_Ins_LYS", "Aug_Ins_Tgt", "Aug_Ins_Act", "Aug_Ins_Act_Per", "Aug_Ins_Growth_Per", 
  "Aug_Reag_LYS", "Aug_Reag_Tgt", "Aug_Reag_Act", "Aug_Reag_Act_Per", "Aug_Reag_Growth_Per", 
  "Aug Total LYS", "Aug Total Tgt", "Aug Total Act", "Aug Ach Per", "Aug Growth Per", 
  "Sep_Ins_LYS", "Sep_Ins_Tgt", "Sep_Ins_Act", "Sep_Ins_Act_Per", "Sep_Ins_Growth_Per", 
  "Sep_Reag_LYS", "Sep_Reag_Tgt", "Sep_Reag_Act", "Sep_Reag_Act_Per", "Sep_Reag_Growth_Per", 
  "Sep Total LYS", "Sep Total Tgt", "Sep Total Act", "Sep Ach Per", "Sep Growth Per", 
  "Oct_Ins_LYS", "Oct_Ins_Tgt", "Oct_Ins_Act", "Oct_Ins_Act_Per", "Oct_Ins_Growth_Per", 
  "Oct_Reag_LYS", "Oct_Reag_Tgt", "Oct_Reag_Act", "Oct_Reag_Act_Per", "Oct_Reag_Growth_Per", 
  "Oct Total LYS", "Oct Total Tgt", "Oct Total Act", "Oct Ach Per", "Oct Growth Per", 
  "Nov_Ins_LYS", "Nov_Ins_Tgt", "Nov_Ins_Act", "Nov_Ins_Act_Per", "Nov_Ins_Growth_Per", 
  "Nov_Reag_LYS", "Nov_Reag_Tgt", "Nov_Reag_Act", "Nov_Reag_Act_Per", "Nov_Reag_Growth_Per", 
  "Nov Total LYS", "Nov Total Tgt", "Nov Total Act", "Nov Ach Per", "Nov Growth Per", 
  "Dec_Ins_LYS", "Dec_Ins_Tgt", "Dec_Ins_Act", "Dec_Ins_Act_Per", "Dec_Ins_Growth_Per", 
  "Dec_Reag_LYS", "Dec_Reag_Tgt", "Dec_Reag_Act", "Dec_Reag_Act_Per", "Dec_Reag_Growth_Per", 
  "Dec Total LYS", "Dec Total Tgt", "Dec Total Act", "Dec Ach Per", "Dec Growth Per"
];


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

function Reports() {
  const { user } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [page, setPage] = useState(0);
  const [ticketsPerPage, setTicketsPerPage] = useState(50);
  const [selectedFilter, setSelectedFilter] = useState("year");
  const [selectedLabels, setSelectedLabels] = useState(FILTER_FIELDS.map(() => []));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalLineAmt, setTotalLineAmt] = useState(0);
  const [totalInvoicedQty, setTotalInvoicedQty] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [availableFilters, setAvailableFilters] = useState({});
  const [chartData, setChartData] = useState([]);
  const [chartPage, setChartPage] = useState(0);  // Unified pagination state

  useEffect(() => {
    const fetchTickets = () => {
      const queryString = `page=${page + 1}&limit=${ticketsPerPage}` +
        (user.accessId === "3" ? `&user=${user.userId}` : user.accessId === "5" ? `&support=${user.userId}` : "");
      fetch(`${baseURL}backend/fetchTTickets.php?${queryString}`)
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
    fetchTickets();
  }, [user, page, ticketsPerPage]);

  useEffect(() => {
    const fetchChartData = () => {
      fetch(`${baseURL}backend/fetchTChartData.php?field=${selectedFilter}`)
        .then(response => response.json())
        .then(data => setChartData(data.chartData))
        .catch(error => console.error("Error fetching chart data:", error));
    };
    fetchChartData();
  }, [selectedFilter]);

  const [isLoadingFilters, setIsLoadingFilters] = useState({});

  useEffect(() => {
    const fetchAllFilterOptions = async () => {
      for (const field of FILTER_FIELDS) {
        try {
          setIsLoadingFilters((prev) => ({ ...prev, [field]: true }));
          const response = await fetch(`${baseURL}backend/fetchTFilterOptions.php?field=${field}`);
          const data = await response.json();
          setAvailableFilters((prev) => ({ ...prev, [field]: data.options }));
        } catch (error) {
          console.error(`Error fetching filter options for ${field}:`, error);
        } finally {
          setIsLoadingFilters((prev) => ({ ...prev, [field]: false }));
        }
      }
    };

    // Fetch options once when component mounts
    fetchAllFilterOptions();
  }, []);
  
  const handleFilterOpen = (index) => {
    // Fetch only if the options are not already loaded
    const field = FILTER_FIELDS[index];
    if (availableFilters[field]) return; // Skip if options already loaded
  };

  const handleFilterChange = (index) => (event) => {
    const { target: { value } } = event;
    setSelectedLabels((prev) => {
      const updated = [...prev];
      updated[index] = typeof value === "string" ? value.split(",") : value;
      return updated;
    });
  };

  // Calculate the filtered totals and update the state
  useEffect(() => {
    const filteredByLabels = tickets.filter((ticket) =>
      selectedLabels.every((labels, index) => {
        const field = FILTER_FIELDS[index];
        return labels.length === 0 || labels.includes(ticket[field] || "");
      })
    );

    let filteredByDate = filteredByLabels;
    if (fromDate || toDate) {
      filteredByDate = filteredByLabels.filter((ticket) => {
        const ticketDate = ticket.date_invoiced;
        return (
          ticketDate >= (fromDate || "1900-01-01") &&
          ticketDate <= (toDate || "2100-01-01")
        );
      });
    }

    const lineTotal = filteredByDate.reduce((sum, item) => sum + Number(item.line_amt), 0);
    const invoicedTotal = filteredByDate.reduce((sum, item) => sum + Number(item.invoiced_qty), 0);

    setTotalLineAmt(lineTotal);
    setTotalInvoicedQty(invoicedTotal);
  }, [selectedLabels, fromDate, toDate, tickets]);

  const domainData = useMemo(() => groupDataByField(selectedFilter, tickets), [selectedFilter, tickets]);
  
  const pieChartData = useMemo(() => {
    return chartData.map(item => {
      const label = item[selectedFilter] || 'Unknown';
      return {
        label: label.length > 12 ? label.slice(0, 10) + '...' : label,
        value: item.count || 0,
      };
    }).slice(chartPage * 6, chartPage * 6 + 6); // Updated from piePage to chartPage
  }, [chartData, selectedFilter, chartPage]);

  const barChartData = useMemo(() => {
    const labels = chartData.map(item => item[selectedFilter]).slice(chartPage * 6, chartPage * 6 + 6); // Same pagination logic
    const values = chartData.map(item => item.count).slice(chartPage * 6, chartPage * 6 + 6); // Adjusted for bar chart
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

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setTicketsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      : header
  );

  return (
    <div className="flex h-full bg-second p-0.5 gap-0.5 font-serif">
      <div className="w-[12.5%] sticky top-0 h-full rounded bg-box p-2 overflow-y-auto">
        {selectedLabels.map((selectedLabel, index) => (
          <FormControl key={index} sx={{ my: 0.5, width: "100%" }} size="small">
            <Select
              multiple
              value={selectedLabel}
              onClick={() => handleFilterOpen(index)}
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
        ))}
      </div>

      <div className="w-[87.5%] overflow-auto">
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
              count={Math.ceil(chartData.length / 6)} // Total pages for chart pagination
              page={chartPage}
              onPageChange={handleChartPageChange} // Unified page change handler
              rowsPerPage={6}
            />
          </div>

          <div className="w-[42.5%] bg-box p-2 rounded">
            <BarChart
              xAxis={[{ scaleType: "band", data: barChartData.labels }]}
              series={[{ data: barChartData.values }]}
              width={400}
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
                "& .MuiTablePagination-select": { fontSize: "10px" },
                "& .MuiTablePagination-actions": { fontSize: "10px" },
                minHeight: "30px",
                ".MuiTablePagination-toolbar": { minHeight: "30px", padding: "0 8px" },
              }}
              count={totalTickets}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={ticketsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 25, 50, 100, 500]}
            />
          </div>

          <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
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
                    .slice(page * ticketsPerPage, page * ticketsPerPage + ticketsPerPage)
                    .map((ticket) => (
                      <TableRow key={ticket.id} hover>
                        {HEADERS.map((header, index) => (
                          <TableCell
                            key={index}
                            align={["line amt", "invoiced qty"].includes(header) ? "center" : "left"}
                            sx={{
                              padding: "2px 4px",
                              fontSize: "11px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              "&:hover": { whiteSpace: "normal", backgroundColor: "#f5f5f5" },
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