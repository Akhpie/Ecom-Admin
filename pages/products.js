import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Button from "@mui/material/Button";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const itemsPerPage = 10;

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const sortedProducts = products.sort((a, b) => {
    if (orderBy === "title") {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className=" bg-cyan-600">
              <TableCell>
                <div className=" text-white text-md font-medium">
                  Product Name
                </div>
              </TableCell>
              <TableCell>
                <div div className=" text-white text-md font-medium">
                  Actions
                </div>
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
                      edit
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
        count={Math.ceil(products.length / itemsPerPage)}
        page={currentPage}
        onChange={onPageChange}
      />
    </Layout>
  );
}
