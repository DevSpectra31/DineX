import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv"
dotenv.config({path:".env"})
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const urlEndpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");

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

function resolveFilePath(filePath, fileUrl) {
  if (filePath) {
    return filePath.startsWith("/") ? filePath : `/${filePath}`;
  }

  if (!fileUrl || !urlEndpoint || !fileUrl.startsWith(urlEndpoint)) {
    return null;
  }

  const derivedPath = fileUrl.slice(urlEndpoint.length);
  return derivedPath.startsWith("/") ? derivedPath : `/${derivedPath}`;
}

function getSignedFileUrl({ filePath, fileUrl, expireSeconds = 60 * 60 * 24 * 30 }) {
  const resolvedPath = resolveFilePath(filePath, fileUrl);
  if (!resolvedPath) {
    return fileUrl;
  }

  return imageKit.helper.buildSrc({
    urlEndpoint,
    src: resolvedPath,
    transformation: [
      {
        original: true,
      },
    ],
    signed: true,
    expiresIn: expireSeconds,
  });
}

export { uploadFile, getSignedFileUrl, resolveFilePath };
