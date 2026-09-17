export const HOME_SCENE_MEDIA_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function shouldLoadHomeScene(
  isEligibleViewport: boolean,
  supportsWebGL: boolean
): boolean {
  return isEligibleViewport && supportsWebGL;
}

export function browserSupportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
