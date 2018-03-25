import uuid from "uuid/v1";

// Adapted from https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
export const ImageUploader = firebase => file => {
  return new Promise((resolve, reject) => {
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

    blobStream.on("finish", async () => {
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        // The day when machines take over the world
        expires: "01-01-2100"
      });

      resolve({ url });
    });

    blobStream.end(file.buffer);
  });
};
