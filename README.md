# Ivan Radev's developer portfolio

[View Live Website](https://ivanradev.site)

This portfolio demonstrates Astro pages that host React, Vue, Svelte, Angular,
and HTMX features while retaining an accessible HTML fallback.

## Installation and development

```sh
yarn install
```

```sh
yarn dev
```

The development command builds the Angular contact application first, then
starts Astro. Angular's generated browser assets are written to
`public/angular/browser` with stable filenames so Astro can serve them.

## Quality checks

```sh
yarn lint
yarn typecheck
yarn test:unit
yarn test:e2e
yarn build
```

The unit suite covers route normalization and progressive enhancement logic.
The Playwright suite covers navigation, asset paths, contact-form delivery
states, responsive behavior, and automated WCAG A/AA checks.

Installing dependencies also installs the Husky pre-commit hook. Before each
commit, `yarn validate` runs ESLint, Astro and Angular type checks, unit tests,
and the complete Playwright suite. Run the same command manually to reproduce
the hook outside Git.

## Architecture

Astro owns routing and the shared layout. Each showcase route demonstrates a
different UI framework: React Three Fiber on the home page, Svelte on Projects,
Vue on Stack, and Angular reactive forms on Contact. The large WebGL dependency
is loaded only for WebGL-capable desktop-class devices that permit motion; compact
viewports and reduced-motion users get the lightweight HTML home experience.

## Contact

Feel free to message me through the website or on
[LinkedIn](https://www.linkedin.com/in/ivan-radev/).
