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
  TableSortLabel,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const itemsPerPage = 10;

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
      <br></br>

      <Link
        href={"/products/new"}
        className=" bg-cyan-900 p-2 rounded-md text-white border-2 border-cyan-800"
      >
        Add new Product
      </Link>

      <br></br>
      <br></br>
      {/* <table>
        <thead>
          <tr>
            <td>Product Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr>
              <td>{product.title}</td>
              <td>Buttons</td>
            </tr>
          ))}
        </tbody>
      </table> */}
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
                    <span className="bg-cyan-600 p-1 rounded-md text-white px-2 inline-flex gap-1 mr-1">
                      EDIT
                      <EditNoteOutlinedIcon />
                    </span>
                  </Link>
                  <Link
                    href={"/products/delete/" + product._id}
                    className="bg-cyan-600 p-1 rounded-md text-white px-2 inline-flex gap-1"
                  >
                    DELETE
                    <DeleteOutlineOutlinedIcon />
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
