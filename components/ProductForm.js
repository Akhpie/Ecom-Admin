import React, { useEffect, useState } from "react";
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
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setgoToProduts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  // to SAVE product
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      _id,
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
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

  // to upload images
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

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
      }
    }
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
      <div>
        <div>
          <label>Category</label>
        </div>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
          // className="cursor-pointer"
        >
          <option value="">Uncategorised</option>
          {categories.length > 0 &&
            categories.map((c) => <option value={c._id}>{c.name}</option>)}
        </select>

        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className="flex gap-1" key={p.name}>
              {/* <div> {p.name} </div> */}
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <select
                className="cursor-pointer"
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>

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
