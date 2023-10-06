import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Pagination } from "@mui/lab";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  InputAdornment,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Layout from "@/components/Layout";
import SearchIcon from "@mui/icons-material/Search";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const itemsPerPage = 10;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const onPageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Layout>
      <div className="mb-4 mt-4">
        <Link href={"/products/new"}>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            endIcon={<AddCircleIcon />}
          >
            Add new Product
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-cyan-600">
              <TableCell>
                <Typography variant="h7" style={{ color: "#fff" }}>
                  Product Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h7" style={{ color: "#fff" }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product._id} className="bg-gray-100">
                <TableCell>{product.title}</TableCell>
                <TableCell>
                  <Link href={"/products/edit/" + product._id}>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      endIcon={<EditNoteOutlinedIcon />}
                    >
                      Edit
                    </Button>
                  </Link>

                  <Link
                    href={"/products/delete/" + product._id}
                    className="mx-2"
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<DeleteOutlineOutlinedIcon />}
                    >
                      Delete
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        className="float-right"
        count={Math.ceil(filteredProducts.length / itemsPerPage)}
        page={currentPage}
        onChange={onPageChange}
      />
    </Layout>
  );
}
