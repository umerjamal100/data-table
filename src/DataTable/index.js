import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import Tooltip from "@mui/material/Tooltip";

import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { TextField } from "@mui/material";
import useDebounce from "../hooks/useDebounce";

function createData(assets, price, change, volume, market, type) {
  return {
    assets,
    price,
    change,
    volume,
    market,
    type,
  };
}

const rows = [
  createData("SPZ", 23418.23, 3.7, 670, 4114, "fiat"),
  createData("CDS", 412, 25.0, 510, 4867.9, "crypto"),
  createData("DEQ", 23418.23, 16.0, 24, 6000.0, "crypto"),
  createData("FOL", 159, 6.0, 24, 40785.0, "crypto"),
  createData("PCV", 356, 16.0, 49, 1353.9, "fiat"),
  createData("RCV", 408, 3.2, 87, 5666.5, "crypto"),
  createData("QSA", 237, 9.0, 37, 1144.3, "fiat"),
  createData("PSA", 375, 1.7, 94, 54320.0, "crypto"),
  createData("PKA", 518, 26.0, 65, 700.0, "crypto"),
  createData("LSA", 392, 0.2, 98, 133.0, "crypto"),
  createData("MPA", 318, 0.5, 81, 2123.0, "fiat"),
  createData("NGP", 360, 19.0, 9, 37445.0, "fiat"),
  createData("OQA", 437, 18.0, 63, 4967.0, "fiat"),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: "assets",
    numeric: false,
    disablePadding: true,
    label: "Assets",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "change",
    numeric: true,
    disablePadding: false,
    label: "Change",
  },
  {
    id: "volume",
    numeric: true,
    disablePadding: false,
    label: "24th Volume",
  },
  {
    id: "market",
    numeric: true,
    disablePadding: false,
    label: "Market Cap",
  },
];

function DataTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="normal"></TableCell>
        {headCells?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              IconComponent={
                orderBy === headCell.id
                  ? ArrowDropDownOutlinedIcon
                  : ArrowDropUpOutlinedIcon
              }
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function DataTableToolbar(props) {
  const { open, handleClickListItem, setSearchTerm } = props;
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
        fontWeight={700}
      >
        Market
      </Typography>
      <TextField
        sx={{ width: "300px" }}
        size="small"
        placeholder="Search asset name."
        onChange={(event) => {
          setSearchTerm(event?.target?.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Tooltip title="Filter list">
        <IconButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function DataTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState("");
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index, option) => {
    setSelectedIndex(index);
    setSelectedOption(option);
    setAnchorEl(null);
  };

  useDebounce(
    () => {
      setFilteredData(
        getFilteredData().filter((d) =>
          d?.assets?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setPage(0);
    },
    [searchTerm],
    800
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getFilteredData = () => {
    return rows.filter((rowItem) => {
      if (selectedOption?.toLowerCase() === "all") {
        return rows;
      }
      return selectedOption?.toLowerCase() === rowItem?.type;
    });
  };

  const options = ["All", "Crypto", "Fiat"];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {options?.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataTableToolbar
          open={open}
          handleClickListItem={handleClickListItem}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <DataTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={
                (searchTerm && filteredData?.length) ||
                getFilteredData()?.length
              }
            />
            <TableBody>
              {stableSort(
                (searchTerm && filteredData) || getFilteredData(),
                getComparator(order, orderBy)
              )
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell padding="checkbox">
                        <div
                          style={{
                            height: "30Px",
                            width: "30px",
                            display: "table-cell",
                            textAlign: "center",
                            verticalAlign: "middle",
                            borderRadius: "50%",
                            background: "grey",
                            color: "white",
                          }}
                        >
                          {row.assets?.[0]}
                        </div>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.assets}
                      </TableCell>
                      <TableCell align="right">{`$ ${row.price}`}</TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{ color: "green" }}
                        >{`+${row.change}`}</Typography>
                      </TableCell>
                      <TableCell align="right">{`${row.volume} M`}</TableCell>
                      <TableCell align="right">{`${row.market} M`}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            (searchTerm && filteredData?.length) || getFilteredData()?.length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
