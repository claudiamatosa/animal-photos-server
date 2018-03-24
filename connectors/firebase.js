import firebase from "firebase";

const config = {
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
  const storage = firebase.storage();

  return {
    photo: id => database.ref(endpoints.photo(id)),
    photos: () => database.ref(endpoints.photos()),
    file: id => storage.ref(endpoints.photos(id))
  };
};

export default Firebase;
