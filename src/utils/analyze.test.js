import { hasCategory, hasTag } from "./analyze";

describe("utils > analyze", () => {
  describe("hasCategory", () => {
    it("returns true when the given category is in the list", () => {
      expect(
        hasCategory("animals")([
          {
            name: "animal_dog"
          },
          {
            name: "people"
          }
        ])
      ).toBe(true);

      expect(
        hasCategory("animal")([
          {
            name: "animals"
          }
        ])
      ).toBe(true);
    });

    it("returns false when the given category is not in the list", () => {
      expect(
        hasCategory("food")([
          {
            name: "animal_dog"
          },
          {
            name: "people"
          }
        ])
      ).toBe(false);
    });
  });

  describe("hasTag", () => {
    it("returns true when the given tag is in the list", () => {
      expect(hasTag("animals")(["animal", "food", "people"])).toBe(true);
      expect(hasTag("animals")(["animals", "food", "people"])).toBe(true);
      expect(hasTag("animal")(["animals", "food", "people"])).toBe(true);
      expect(hasTag("person")(["animals", "food", "people"])).toBe(true);
      expect(hasTag("people")(["animals", "food", "person"])).toBe(true);
    });

    it("returns false when the given tag is not in the list", () => {
      expect(hasTag("animals")(["food", "people"])).toBe(false);
    });
  });
});
