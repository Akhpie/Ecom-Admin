// import Layout from "@/components/Layout";
// import Spinner from "@/components/Spinner";
// import Button from "@mui/material/Button";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { withSwal } from "react-sweetalert2";
// import { prettyDate } from "@/lib/date";

// function AdminsPage({ swal }) {
//   const [email, setEmail] = useState("");
//   const [adminEmails, setAdminEmails] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   function addAdmin(ev) {
//     ev.preventDefault();
//     axios.post("/api/admins", { email }).then((res) => {
//       console.log(res.data);
//       swal.fire({
//         title: "Admin Created!",
//         icon: "success",
//       });
//       setEmail("");
//       loadAdmins();
//     });
//   }

//   function loadAdmins() {
//     setIsLoading(true);
//     axios.get("/api/admins").then((res) => {
//       setAdminEmails(res.data);
//       setIsLoading(false);
//     });
//   }

//   useEffect(() => {
//     loadAdmins();
//   }, []);

//   return (
//     <Layout>
//       <h1>Admins</h1>
//       <h2 className="mb-2">Add new admin</h2>

//       <form className="mb-4" onSubmit={addAdmin}>
//         <div className="flex gap-4">
//           <input
//             type="text"
//             className="mb-0"
//             placeholder="google email"
//             value={email}
//             onChange={(ev) => setEmail(ev.target.value)}
//           />
//           <Button
//             type="submit"
//             size="small"
//             variant="contained"
//             color="success"
//             className="whitespace-nowrap"
//           >
//             Add admin
//           </Button>
//         </div>
//       </form>

//       <h2>Existing Admins</h2>
//       <table>
//         <thead>
//           <tr>
//             <th className="text-left">Admin Google Email</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading && (
//             <tr>
//               <td colSpan={2}>
//                 <div className="py-4">
//                   <Spinner fullWidth={true} />
//                 </div>
//               </td>
//             </tr>
//           )}
//           {adminEmails.length > 0 &&
//             adminEmails.map((adminEmail) => (
//               <tr>
//                 <td>{adminEmail.email}</td>
//                 <td>{prettyDate(adminEmail.createdAt)}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </Layout>
//   );
// }

// export default withSwal(({ swal }) => <AdminsPage swal={swal} />);

import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function addAdmin(ev) {
    ev.preventDefault();
    axios
      .post("/api/admins", { email })
      .then((res) => {
        console.log(res.data);
        swal.fire({
          title: "Admin Created!",
          icon: "success",
        });
        setEmail("");
        loadAdmins();
      })
      .catch((err) => {
        console.log(err);
        swal.fire({
          title: "Error!",
          text: err.response.data.message,
          icon: "error",
        });
      });
  }

  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to remove ${email} as an Admin?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin Deleted!",
              icon: "success",
            });
            loadAdmins();
          });
        }
      });
  }

  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Layout>
      <h1>Admins</h1>
      <h2 className="mb-2">Add new admin</h2>

      <form className="mb-4" onSubmit={addAdmin}>
        <div className="flex gap-4">
          <input
            type="text"
            className="mb-0"
            placeholder="google email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="success"
            className="whitespace-nowrap"
          >
            Add admin
          </Button>
        </div>
      </form>

      <h2>Existing Admins</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-cyan-600">
            <TableRow>
              <TableCell>
                <div className="text-white">Admin Google Email</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Created At</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Actions</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Spinner fullWidth={true} />
                </TableCell>
              </TableRow>
            ) : (
              adminEmails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((adminEmail) => (
                  <TableRow key={adminEmail.email}>
                    <TableCell>{adminEmail.email}</TableCell>
                    <TableCell>
                      {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<DeleteIcon />}
                        onClick={() =>
                          deleteAdmin(adminEmail._id, adminEmail.email)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={adminEmails.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </TableContainer>
    </Layout>
  );
}

export default withSwal(({ swal }) => <AdminsPage swal={swal} />);
