import { GraphQLUpload } from "apollo-upload-server";
import { compose, join, map, mapObjIndexed, reverse, values } from "ramda";

import Firebase from "../connectors/firebase";
import ComputerVision from "../connectors/computer-vision";
import { hasCategory, hasTag } from "../utils/analyze";
import { ImageUploader } from "../utils/images";
import { addBufferToFile } from "../utils/file";
import { ServerError } from "../utils/errors";

const firebase = Firebase();
const imageUploader = ImageUploader(firebase);
const computerVision = ComputerVision();

const flattenCategories = map(category => category.name);

export default {
  Upload: GraphQLUpload,

  Mutation: {
    addPhoto: async (_, { data: { photo } }) => {
      let file = await addBufferToFile(photo);
      const { categories, description } = await computerVision.analyze(file);

      if (
        !hasCategory("animals")(categories) &&
        !hasTag("animals")(description.tags)
      ) {
        throw new Error("no animals in here");
        //
        // throw new Error(`
        //   MS Computer vision api didnʼt find animals in this photo.
        //
        //   tags: ${join(", ")(description.tags)}
        //
        //   categories: ${compose(join(", "), flattenCategories)(
        //     categories
        //   )}
        // `);
        //
        // throw new ServerError(
        //   "MS Computer vision api didnʼt find animals in this photo.",
        //   {
        //     tags: description.tags,
        //     categories: flattenCategories(categories)
        //   }
        // );
      }

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
        reverse,
        values,
        mapObjIndexed((photo, key) => ({ id: key, ...photo }))
      )(snapshot.val());
    }
  }
};
