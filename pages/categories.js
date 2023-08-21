import Layout from "@/components/Layout";
import Category from "@/models/Category";
import Button from "@mui/material/Button";
import axios from "axios";
import { useState, useEffect } from "react";
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

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    await axios.post("/api/categories", { name, parentCategory });
    setName("");
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category Name</label>
      <form className="flex gap-1" onSubmit={saveCategory}>
        <input
          className="mb-0"
          type="text"
          placeholder={"Category Name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        ></input>

        <select
          className=" cursor-pointer"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>

        <Button variant="contained" color="success" type="submit">
          Save
        </Button>
      </form>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead className="bg-cyan-600 w-max text-center flex justify-center">
            <TableRow>
              <TableCell>
                <div className="text-white">Category Name</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Parent Category</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Actions</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 &&
              categories.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ) &&
              categories.map((category) => (
                <TableRow>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category?.parent?.name}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="contained" color="info" size="small">
                        Edit
                      </Button>
                      <Button variant="contained" color="error" size="small">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={categories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Layout>
  );
}
