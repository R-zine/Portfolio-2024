class Tech {
  name: string;
  url: string;
  year: number;
  description: string;
  constructor(name: string, url: string, year: number, description: string) {
    this.name = name;
    this.url = `./icons/${url}.png`;
    this.year = year;
    this.description = description;
  }
}

export const TechArray: Tech[] = [
  new Tech("Typescript", "ts", 2020, "Typescript desc"),
  new Tech("Javascript", "js", 2007, "Javascript desc"),
  new Tech("HTML", "html", 2006, "HTML desc"),
  new Tech("CSS", "css", 2006, "CSS desc"),
  new Tech("React", "react", 2020, "React desc"),
  new Tech("React Fiber / ThreeJS", "threejs", 2020, "Fiber desc"),
  new Tech("Redux / Toolkit", "redux", 2020, "Redux desc"),
  new Tech("Material UI", "mui", 2020, "MUI desc"),
  new Tech("NextJS", "next", 2022, "NextJS desc"),
  new Tech("Astro", "astro", 2022, "Astro desc"),
  new Tech("React Native / Expo", "expo", 2021, "Expo desc"),
  new Tech("Ionic", "ionic", 2022, "Ionic desc"),
  new Tech("Github", "github", 2021, "Git desc"),
  new Tech("Cucumber / Gherkin / BDD", "cucumber", 2022, "BDD desc"),
  new Tech("Cypress", "cypress", 2021, "Cypress desc"),
  new Tech("Jest / Vitest", "jest", 2020, "Jest desc"),
  new Tech("Angular", "angular", 2022, "Angular desc"),
  new Tech("Vue", "vue", 2022, "Vue desc"),
  new Tech("Svelte", "svelte", 2022, "Svelte desc"),
  new Tech("Prisma", "prisma", 2022, "Prisma desc"),
  new Tech("NodeJS", "node", 2020, "Node desc"),
  new Tech("NestJS", "nest", 2023, "Nest desc"),
  new Tech("Vite", "vite", 2021, "Vite desc"),
  new Tech("ActionScript / Flash", "actionscript", 2006, "Flash desc"),
];
