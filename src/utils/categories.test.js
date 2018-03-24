import { hasCategory } from "./categories";

describe("utils > categories", () => {
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
        hasCategory("animals")([
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
});
