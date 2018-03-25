import path from "path";
import firebase from "firebase-admin";
import Storage from "@google-cloud/storage";

import serviceAccount from "./storage-keys.json";

const config = {
  credential: firebase.credential.cert(serviceAccount),
  apiKey: process.env.AF_FIREBASE_API_KEY,
  authDomain: process.env.AF_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.AF_FIREBASE_DATABASE_URL,
  projectId: process.env.AF_FIREBASE_PROJECT_ID,
  storageBucket: process.env.AF_FIREBASE_STORAGE_BUCKET
};

const endpoints = {
  photos: () => `photos`,
  photo: id => `photos/${id}`
};

const Firebase = () => {
  firebase.initializeApp(config);
  const database = firebase.database();

  const storage = new Storage({
    projectId: config.projectId,
    keyFilename: path.join(__dirname, "storage-keys.json")
  });

  return {
    photo: id => database.ref(endpoints.photo(id)),
    photos: () => database.ref(endpoints.photos()),
    storage: () => storage.bucket(config.storageBucket)
  };
};

export default Firebase;
