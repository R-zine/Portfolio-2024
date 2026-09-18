class Project {
  description: string;
  tech: string[];
  preview: string;
  source: string;
  site: string;

  constructor(
    description: string,
    tech: string[],
    preview: string,
    source: string,
    site: string
  ) {
    this.description = description;
    this.tech = tech;
    this.preview = `/projects/${preview}.jpg`;
    this.source = source;
    this.site = site;
  }
}

export const projects = [
  new Project(
    "AIditorial is a privacy-focused writing editor that runs a language model locally in the browser through WebLLM and WebGPU. It supports chat, focused edits, side-by-side comparisons, DOCX and ODT imports, resumable batch processing, and local history stored in IndexedDB—without sending the user's text to an application server.",
    [
      "Next.js / React / TypeScript",
      "WebLLM / WebGPU",
      "Dexie / IndexedDB",
      "Tailwind CSS / Radix UI",
      "Vitest",
    ],
    "aiditorial",
    "https://github.com/R-zine/aiditorial",
    "https://aiditorial.netlify.app/"
  ),
  new Project(
    "A reproducible browser benchmark for comparing five sorting algorithms across JavaScript and WebAssembly builds produced with AssemblyScript, Rust, C, C++, Go, and Zig. Experiments use identical seeded datasets, isolated Web Workers, warm-up and measured runs, correctness checks, robust statistics, interactive visualizations, and JSON or CSV export.",
    [
      "React / TypeScript / Vite",
      "WebAssembly",
      "AssemblyScript / Rust / C / C++ / Go / Zig",
      "Web Workers",
      "Material UI / Recharts / Zustand",
    ],
    "wasm-benchmark",
    "https://github.com/R-zine/awesome-algo-benchmark",
    "https://wasmbenchmark.netlify.app/"
  ),
  new Project(
    "A low-level WebGL2 renderer written in Rust, compiled to WebAssembly, and presented through a React interface. It loads binary glTF scenes with node transforms, mesh instancing, textures, materials, and multiple primitive modes, while explicitly managing GPU resources and the WebAssembly lifecycle.",
    [
      "Rust / WebAssembly",
      "WebGL2 / glTF",
      "React / TypeScript / Vite",
      "Material UI / Emotion",
      "Vitest",
    ],
    "rust-model-viewer",
    "https://github.com/R-zine/3D-model-viewer--Rust",
    "https://rusty-model-viewer.netlify.app/"
  ),
  new Project(
    "A GLB 2.0 renderer and parser written in Go, compiled to WebAssembly, and presented through a React interface. It uses only the Go standard library and browser WebGL2 APIs for strict, allocation-bounded parsing, scene hierarchies, mesh primitives, embedded textures, materials, responsive rendering, and deterministic GPU resource cleanup.",
    [
      "Go / WebAssembly",
      "WebGL2 / glTF",
      "React / TypeScript / Vite",
      "Material UI / Emotion",
      "Playwright",
    ],
    "go-model-viewer",
    "https://github.com/R-zine/3D-model-viewer-go",
    "https://goland-model-viewer.netlify.app/"
  ),
  new Project(
    "Unfair Pong is a browser game that pits the player against a NEAT-trained agent. Points earned by returning balls can be spent on deliberately unfair upgrades until the AI can be beaten. The agent is trained in a deterministic Python environment, exported as a versioned network, and executed directly by the TypeScript client.",
    [
      "Python / NEAT-Python",
      "React / TypeScript / Vite",
      "Zustand",
      "NES.css",
      "Pygame (training visualization)",
    ],
    "unfair-pong",
    "https://github.com/R-zine/PyPong",
    "https://unfair-pong.netlify.app/"
  ),
  new Project(
    "My 2023 developer portfolio is an experimental, desktop-first 3D experience. React Three Fiber and Drei render the scenes, Rapier provides physics, Redux Toolkit manages application state, and GSAP drives motion.",
    [
      "React / TypeScript / Vite",
      "React Three Fiber / Drei",
      "Rapier physics",
      "Redux Toolkit",
      "GSAP",
      "Emotion",
    ],
    "portfolio2023",
    "https://github.com/R-zine/Portfolio-2023",
    "https://ivanradev2023.netlify.app/"
  ),
  new Project(
    "My 2021 developer portfolio combines a conventional React interface with a Three.js-powered technology showcase. It uses React Router for navigation and GSAP for animation.",
    [
      "React / TypeScript",
      "React Router",
      "React Three Fiber / Drei",
      "GSAP",
      "Create React App",
    ],
    "port2021",
    "https://github.com/R-zine/PortfolioSite2021/",
    "https://ivanradev2021.netlify.app/"
  ),
  new Project(
    "Stackr is a responsive 3D shape-stacking game with square, wide, round, and triangular pieces. Each successful placement increases the speed, the next-piece preview changes the strategy, and a missed placement sends the completed tower into a physics simulation. High scores are saved locally.",
    [
      "React / TypeScript / Vite",
      "React Three Fiber / Drei",
      "React Three Cannon",
      "GSAP",
      "Vitest",
    ],
    "stacker",
    "https://github.com/R-zine/stackr",
    "https://stckr.netlify.app/"
  ),
  new Project(
    "A full-stack Snake game built with Next.js, Prisma, and PostgreSQL hosted on Supabase. User preferences are persisted in the database, while the game speed, growth rate, and board size are configurable. Touch controls are rendered automatically on mobile devices.",
    ["Next.js", "Prisma", "PostgreSQL / Supabase", "Sass"],
    "snake",
    "https://github.com/R-zine/snake-next-js",
    "https://next-snake-taupe.vercel.app/"
  ),
  new Project(
    "A traditional-painting portfolio and storefront built with Astro and React. Painting metadata is compiled from local content for a fast static deployment, while Nanostores, React Spring, and GSAP power the interactive storefront. A separate local-only React and Django CMS manages painting records and images.",
    [
      "Astro / React / TypeScript",
      "Nanostores",
      "Emotion / React Spring / GSAP",
      "Django / Ant Design (local CMS)",
    ],
    "art",
    "https://github.com/R-zine/paitings-website-v2",
    "https://ivanradevart.netlify.app/"
  ),
  new Project(
    "Item Hunter is a React Native scavenger-hunt game in which players select everyday objects and validate their finds with on-device image classification. The current version uses Apple Vision on iOS and Google ML Kit on Android, requests the camera only for an explicit scan, and saves progress locally.",
    [
      "React Native / Expo / TypeScript",
      "Apple Vision / Google ML Kit",
      "AsyncStorage",
      "Jest / Expo tooling",
    ],
    "native",
    "https://github.com/R-zine/ItemHunter",
    "https://item-hunter-preview.netlify.app/"
  ),
  new Project(
    "A responsive portfolio for an architect and interior designer, featuring image-rich project galleries, animated route transitions, and a custom 3D contact scene. The build also generates optimized responsive gallery assets and a compressed glTF model as part of its deployment pipeline.",
    [
      "React / TypeScript / Vite",
      "React Router",
      "Motion",
      "React Three Fiber / Drei",
      "Sharp / glTF Transform",
    ],
    "arch",
    "https://github.com/R-zine/architect-portfolio",
    "https://dradeva.com/"
  ),
];
