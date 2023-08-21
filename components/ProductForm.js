import React, { useState } from "react";
import { Router, useRouter } from "next/router";
import Layout from "@/components/Layout";
import axios from "axios";
import Button from "@mui/material/Button";
import PublishIcon from "@mui/icons-material/Publish";
import Spinner from "./Spinner";
import ReactSortable from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setgoToProduts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { _id, title, description, price, images };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setgoToProduts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      // const res = await axios.post("/api/upload", data, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder() {
    console.log(arguments);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Product Name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        {!!images?.length &&
          images.map((link) => (
            <div key={link} className="inline-block h-28">
              <img src={link} className="rounded-md"></img>
            </div>
          ))}

        {isUploading && (
          <div className="h-28 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-28 h-28 border flex flex-col items-center justify-center rounded-md drop-shadow-sm hover:drop-shadow-md bg-gray-300 cursor-pointer">
          <PublishIcon />
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>

        {/* {!images?.length && <div>No Photos for this Product</div>} */}
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (In USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      ></input>
      <Button type="submit" variant="contained" color="info" size="small">
        Save
      </Button>
    </form>
  );
}
