import uuid from "uuid/v1";
import convertStream from "convert-stream";

// Taken from https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
export const ImageUploader = firebase => file => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      reject("No image file");
    }

    const newFileName = `${uuid()}-${file.filename}`;

    const bucket = firebase.storage();
    const fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", error => {
      reject(error);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${
        fileUpload.name
      }`;
      resolve({ url });
    });

    const buffer = await convertStream.toBuffer(file.stream);
    blobStream.end(buffer);
  });
};
