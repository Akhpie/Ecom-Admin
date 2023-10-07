import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  //   res.json(req.method);
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  //   mongoose.connect(clientPromise.url)

  // PRODUCT MANAGEMENT

  // GET ALL PRODUCTS
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }
  // mongoose.Promise = clientPromise;

  // CREATE PRODUCT
  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }

  // UPDATE PRODUCT
  if (method === "PUT") {
    const { title, description, price, images, category, properties, _id } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );
    res.json(true);
  }

  // DELETE PRODUCT
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
