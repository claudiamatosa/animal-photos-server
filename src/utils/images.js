import uuid from "uuid/v1";

// Taken from https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
export const ImageUploader = firebase => file => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${uuid()}`;

    let fileUpload = firebase.storage().file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", error => {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      resolve({ url });
    });

    blobStream.end(file.buffer);
  });
  return prom;
};
