import multiparty from "multiparty";
// import S3Client from "aws-sdk/clients/s3";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

const bucketName = "aks-next-ecom";

export default async function (req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res);
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log("length:", files.file.length);
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFileName = Date.now() + "." + ext;
    console.log({ ext, file });
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
