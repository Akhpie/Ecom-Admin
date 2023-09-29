// import Layout from "@/components/Layout";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Spinner from "@/components/Spinner";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   useEffect(() => {
//     setIsLoading(true);
//     axios.get("/api/orders").then((response) => {
//       setOrders(response.data);
//       setIsLoading(false);
//     });
//   }, []);
//   return (
//     <Layout>
//       <h1>Orders</h1>
//       <table className="basic">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Paid</th>
//             <th>Recipient</th>
//             <th>Products</th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading && (
//             <tr>
//               <td colSpan={4}>
//                 <div className="py-4">
//                   <Spinner fullWidth={true} />
//                 </div>
//               </td>
//             </tr>
//           )}
//           {orders.length > 0 &&
//             orders.map((order) => (
//               <tr>
//                 <td>{new Date(order.createdAt).toLocaleString()}</td>
//                 <td className={order.paid ? "text-green-600" : "text-red-600"}>
//                   {order.paid ? "YES" : "NO"}
//                 </td>
//                 <td>
//                   {order.name} {order.email}
//                   <br />
//                   {order.city} {order.postalCode} {order.country}
//                   <br />
//                   {order.streetAddress}
//                 </td>
//                 <td>
//                   {order.line_items.map((l) => (
//                     <>
//                       {l.price_data?.product_data.name} x{l.quantity}
//                       <br />
//                     </>
//                   ))}
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </Layout>
//   );
// }

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <h1>Orders</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-cyan-800">
            <TableRow>
              <TableCell>
                <div className="text-white">Date</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Paid</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Recipient</div>
              </TableCell>
              <TableCell>
                <div className="text-white">Products</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0
                ? orders.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : orders
              ).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={
                      order.paid ? "bg-green-600" : "bg-red-600 rounded-sm"
                    }
                  >
                    {order.paid ? "YES" : "NO"}
                  </TableCell>
                  <TableCell>
                    {order.name}, {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country}
                    <br />
                    {order.streetAddress}
                  </TableCell>
                  <TableCell>
                    {order.line_items.map((l) => (
                      <div key={l.id}>
                        {l.price_data?.product_data.name} x{l.quantity}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Layout>
  );
}
