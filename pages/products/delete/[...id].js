import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  // when clicked on NO
  function goBack() {
    router.push("/products");
  }

  // to DELETE product
  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;"{productInfo?.title}"?
      </h1>
      <div className=" flex justify-center">
        <Button
          onClick={deleteProduct}
          color="error"
          size="small"
          variant="contained"
        >
          YES
        </Button>
        <Button
          onClick={goBack}
          className="ml-2"
          color="success"
          variant="contained"
          size="small"
          style={{ marginLeft: "10px" }}
        >
          NO
        </Button>
      </div>
    </Layout>
  );
}
