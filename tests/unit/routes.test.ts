import { describe, expect, it } from "vitest";
import {
  getPageInformation,
  isActiveRoute,
  normalizePathname,
} from "../../src/utils/routes";

describe("route normalization", () => {
  it.each([
    [undefined, "/"],
    [null, "/"],
    ["", "/"],
    ["/", "/"],
    ["stack", "/stack"],
    ["/stack/", "/stack"],
    ["/projects///?source=test", "/projects"],
    ["/contact/#form", "/contact"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePathname(input)).toBe(expected);
  });

  it("compares canonical routes after normalization", () => {
    expect(isActiveRoute("/projects/", "/projects")).toBe(true);
    expect(isActiveRoute("/stack", "/projects")).toBe(false);
  });
});

describe("page information", () => {
  it.each([
    ["/", "React 18"],
    ["/projects/", "Svelte 4"],
    ["/stack/", "Vue 3"],
    ["/contact/", "Angular 17"],
  ])("returns content for %s", (route, technology) => {
    expect(getPageInformation(route)).toContain(technology);
  });

  it("returns a safe fallback for unknown routes", () => {
    expect(getPageInformation("/unknown")).toBe(
      "Information is not available for this page."
    );
  });
});
