import uuid from "uuid/v1";
import { GraphQLUpload } from "apollo-upload-server";
import Firebase from "../connectors";

const firebase = Firebase();

export default {
  Upload: GraphQLUpload,

  Mutation: {
    addPhoto: async (_, { file }) => {
      // TODO: get file type
      // TODO: hit the microsoft computer vision api to check if the photo contains an animal
      // https://docs.microsoft.com/en-gb/azure/cognitive-services/computer-vision/home#a-namecategorizingcategorizing-imagesa
      const id = uuid();
      const contentType = "image/jpeg";
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
