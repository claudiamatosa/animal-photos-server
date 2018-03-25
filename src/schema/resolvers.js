import { GraphQLUpload } from "apollo-upload-server";
import {
  append,
  compose,
  join,
  map,
  mapObjIndexed,
  reverse,
  values
} from "ramda";

import Firebase from "../connectors/firebase";
import ComputerVision from "../connectors/computer-vision";
import { hasCategory, hasTag } from "../utils/analyze";
import { ImageUploader } from "../utils/images";
import { addBufferToFile } from "../utils/file";
import { ComputerVisionApiError, ServerError } from "../utils/errors";

const firebase = Firebase();
const imageUploader = ImageUploader(firebase);
const computerVision = ComputerVision();

const flattenCategories = map(category => category.name);

const mockPhoto = {
  id: "-2398r7wyeihfudsfhy942",
  src:
    "https://storage.googleapis.com/animal-photos.appspot.com/2e043130-3025-11e8-bac3-df5aff3ec41d-P1010963.JPG?GoogleAccessId=firebase-adminsdk-csl5i@animal-photos.iam.gserviceaccount.com&Expires=4102444800&Signature=YhR%2F%2F6jdkE0EjqGvIzHfgtj9KAdQoo4ptTQ8Dfa3ZZpzWxD1vV0vqIO3xoptk2KeYtXQlVMpOMUraL1iHFVzc5bJTKSbeb%2FBZGfPkzUCAUCLwtpWo8kcczXpRF6s2Zb46VQPxY51mtu4KMYVfT7AR9T%2Bvk17xYBXBj3CUnigISvafKxDsNXjRcqdF67Mp7W%2F03nbgpyafAA6rgUUsteSCTK5g4ReozdnPx%2B6PMXMZxPhvwdHfSI9ugrzgBmEglQ6Ye%2FUw4LY6XYkI6iyOJmJz9OzxXFhEcyNhPTwNabTFAJ%2FL733kBh6NX3X5Qi7%2F%2BO9h518qr2QclXmVphgwOaTZQ%3D%3D",
  description: "",
  tags: []
};

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
        throw new ComputerVisionApiError(
          "MS Computer vision api didnʼt find animals in this photo.",
          {
            code: "ANIMAL_NOT_FOUND",
            tags: description.tags,
            categories: flattenCategories(categories)
          }
        );
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
        append(mockPhoto),
        reverse,
        values,
        mapObjIndexed((photo, key) => ({ id: key, ...photo }))
      )(snapshot.val());
    }
  }
};
