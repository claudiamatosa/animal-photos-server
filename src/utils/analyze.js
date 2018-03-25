import { anyPass, compose, equals, find, map, is } from "ramda";
import pluralize from "pluralize";

const equalsPlural = word => equals(pluralize(word));
const equalsSingular = word => equals(pluralize(word, 1));
const equalsWord = word => anyPass([equalsPlural(word), equalsSingular(word)]);

export const hasCategory = category =>
  compose(
    is(String),
    find(equalsWord(category)),
    map(data => data.name.split("_")[0])
  );

export const hasTag = category =>
  compose(is(String), find(equalsWord(category)));
