export const portfolioRoutes = ["/", "/projects", "/stack", "/contact"] as const;

export type PortfolioRoute = (typeof portfolioRoutes)[number];

export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname) return "/";

  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;

  return withLeadingSlash === "/"
    ? "/"
    : withLeadingSlash.replace(/\/+$/, "");
}

export function isActiveRoute(
  currentPathname: string | null | undefined,
  route: PortfolioRoute
): boolean {
  return normalizePathname(currentPathname) === route;
}

const pageInformation: Record<PortfolioRoute, string> = {
  "/":
    "This page is written in React 18 and uses React Three Fiber and Drei to display a WebGL-powered 3D scene on capable, wide-screen devices. The information panel and mobile menu use HTMX, while smaller or less capable devices receive a lightweight HTML fallback.",
  "/projects":
    "This page is written in Svelte 4 and uses svelte-inview and Svelte's built-in transitions API.",
  "/stack":
    "This page is written in Vue 3 using the Composition API. The detail animations are powered by GSAP.",
  "/contact":
    "This page is written in Angular 17 with reactive form controls. The Angular application is built as a separate, reproducible bundle and loaded by Astro.",
};

export function getPageInformation(
  pathname: string | null | undefined
): string {
  const normalized = normalizePathname(pathname) as PortfolioRoute;
  return pageInformation[normalized] ?? "Information is not available for this page.";
}
