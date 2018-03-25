import { GraphQLUpload } from "apollo-upload-server";
import { compose, mapObjIndexed, values } from "ramda";

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
      const { categories, description } = await computerVision.analyze(file);

      if (!hasCategory("animals")(categories)) throw new Error("nope");

      const { url } = await imageUploader(file);

      const photoData = {
        src: url,
        description: description.captions[0].text,
        tags: description.tags
      };

      const { key } = await firebase.photos().push(photoData);

      return { id: key, ...photoData };
    }
  },

  Query: {
    photo: async (_, { id }) => {
      const snapshot = await firebase.photo(id).once("value");

      return {
        id: Object.keys(snapshot.val())[0],
        ...snapshot.val()
      };
    },
    photos: async () => {
      const snapshot = await firebase.photos().once("value");

      return compose(
        values,
        mapObjIndexed((photo, key) => ({ id: key, ...photo }))
      )(snapshot.val());
    }
  }
};
