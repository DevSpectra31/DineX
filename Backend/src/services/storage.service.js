import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv"
dotenv.config({path:".env"})
import fs from "fs";
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  try {
      const base64File = file.toString("base64");
    const result = await imageKit.files.upload({
      file:base64File,
      fileName:fileName,
    });

    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error.message);
    throw error;
  }
}

export { uploadFile };