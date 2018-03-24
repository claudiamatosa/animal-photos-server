import { GraphQLUpload } from "apollo-upload-server";
import Firebase from "../connectors/firebase";
import ComputerVision from "../connectors/computer-vision";
import { hasCategory } from "../utils/categories";
import { ImageUploader } from "../utils/images";
import { addBufferToFile } from "../utils/file";

const firebase = Firebase();
const imageUploader = ImageUploader(firebase);
const computerVision = ComputerVision();

export default {
  Upload: GraphQLUpload,

  Mutation: {
    addPhoto: async (_, { data: { photo } }) => {
      let file = await addBufferToFile(photo);
      const { categories } = await computerVision.analyze(file);

      if (!hasCategory("animals")(categories)) throw new Error("nope");

      const { url } = await imageUploader(file);
      const { key } = await firebase.photos().push(url);

      return { id: key, src: url };
    }
  },

  Query: {
    photo: async (_, { id }) => {
      const snapshot = await firebase.photo(id).once();

      return {
        id: Object.keys(snapshot.val())[0], // TODO: check if snapshot.key works
        src: snapshot.val()
      };
    },
    photos: async () => {
      const snapshot = firebase.photos().once();
      return snapshot.val();
    }
  }
};
