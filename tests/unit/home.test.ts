import { describe, expect, it } from "vitest";
import { shouldLoadHomeScene } from "../../src/utils/home";

describe("3D home scene loading", () => {
  it.each([
    [true, true, true],
    [true, false, false],
    [false, true, false],
    [false, false, false],
  ])(
    "uses eligible-viewport=%s and webgl=%s to return %s",
    (isEligibleViewport, supportsWebGL, expected) => {
      expect(
        shouldLoadHomeScene(isEligibleViewport, supportsWebGL)
      ).toBe(expected);
    }
  );
});
