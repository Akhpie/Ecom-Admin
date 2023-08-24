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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { withSwal } from "react-sweetalert2";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, []);

  //Fetch categories
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  // Save categories
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  //Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Editting categories
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  // Deleting Categories
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  // ADDING PROPERTY
  async function addProperty(ev) {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  // handling properties change
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  // handling values change
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  // removing properties
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            // className="mb-0"
            type="text"
            placeholder={"Category Name"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />

          <select
            className=" cursor-pointer border-2 rounded-md "
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value={""}>No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <div className="mb-2">
            <Button
              type="button"
              variant="contained"
              color="secondary"
              size="small"
              onClick={addProperty}
            >
              Add new property
            </Button>
          </div>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  placeholder="property name (ex: color)"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  className="mb-0"
                />
                <input
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  type="text"
                  placeholder="values, comma seperated"
                  value={property.values}
                  className="mb-0"
                />
                <div>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    size="small"
                    endIcon={<RemoveCircleOutlineIcon />}
                    onClick={() => removeProperty(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <Button
              type="button"
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            type="submit"
            size="small"
          >
            Save
          </Button>
        </div>
      </form>

      {!editedCategory && (
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
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<EditNoteIcon />}
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => deleteCategory(category)}
                        >
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
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
