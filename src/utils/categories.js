import { compose, equals, find, is, map } from "ramda";
import pluralize from "pluralize";

export const hasCategory = category =>
  compose(
    is(String),
    find(equals(category)),
    map(data => pluralize(data.name.split("_")[0]))
  );
