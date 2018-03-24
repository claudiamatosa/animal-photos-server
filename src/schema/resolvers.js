import uuid from "uuid/v1";
import { GraphQLUpload } from "apollo-upload-server";
import Firebase from "../connectors/firebase";
import ComputerVision from "../connectors/computer-vision";

const firebase = Firebase();
const computerVision = ComputerVision();

export default {
  Upload: GraphQLUpload,

  Mutation: {
    addPhoto: async (_, { file }) => {
      const { categories, metadata: { format } } = await computerVision.analyze(
        file
      );

      if (!hasCategory("animals")(categories)) throw new Error("nope");

      const id = uuid();
      const contentType = `image/${format.toLowerCase()}`;
      const storageRef = await firebase.file(id);
      await storageRef.put(file, { contentType });

      const { key } = await firebase.photo().push(fullPath);

      return { id: key, src: storageRef.fullPath };
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
