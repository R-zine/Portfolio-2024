export class Tech {
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
  new Tech(
    "Typescript",
    "ts",
    2020,
    "Typescript is basically mandatory when working on any project that has more than one developer working on it and it can still be very useful even if coding on my own. I like the flexibility it provides and how seamlessly it's integrated with all major frameworks."
  ),
  new Tech(
    "Javascript",
    "js",
    2007,
    "My journey with JavaScript started one summer when I was hired by the local PC-store to inject content into premade templates. Ever since then I've learned a lot, but still find new things to learn every day. Fundamentally, I think JS is the language for me. I find there is a lot of beauty in its weird and chaotic ways."
  ),
  new Tech(
    "HTML",
    "html",
    2006,
    "HTML is the basis of the web and with SSR the importance of having good fundamentals has become even more apparent. It's also really cool how that has driven HTML to improve so it is less reliant on client-side JS."
  ),
  new Tech(
    "CSS",
    "css",
    2006,
    "It's definitely a love-and-hate relationship with CSS and it's related libraries like SASS, SCSS, styled-components. It can be extremely gratifying to turn ugly boxes into a pretty UI, but at the same time, it could also be a big pain to find why a particular, very nested MUI component refuses to style the way you want it to. However, even nowadays I like taking the odd complicated CSS ticket for a change of pace."
  ),
  new Tech(
    "React",
    "react",
    2020,
    "React is nowadays my bread and butter. I like to think I know 99.9% of what there is to know about Hook React itself, though the ecosystem is so vast I feel like everyday something new and cool comes out that can be integrated to a React project with a NPM command."
  ),
  new Tech(
    "React Fiber / ThreeJS",
    "threejs",
    2020,
    "I started coding because I wanted to make games, and while doing so in JavaScript isn't very popular, ThreeJS and its port to React have been a passion of mine. I've contributed to some indie games, and though not usually related to enterprise work, that was a great learning experience. A recent development in the Fiber world that I especially like is React Rapier, which is a built-in physics engine that replaces the need to use third-party options like CannonJS."
  ),
  new Tech(
    "Redux / Toolkit",
    "redux",
    2020,
    "Redux Toolkit is my prefered state and query manager for anything but the smallest projects. Having a one-stop solution for managing state, fetching, and caching with good documentation and an active community which has mostly answered all possible niche cases is indispensable on a large project. For small projects where Redux could be seen as an overkill, I've used Atom and Zustand, which are fairly modern and cool ways to manage global state."
  ),
  new Tech(
    "Material UI",
    "mui",
    2020,
    "MUI is the most popular React UI library and for a reason. Styling can be managed through a global theme, they have mostly everything needed for the typical enterprise project, and the native support for styled components is really nice on projects that can span in the hundreds of thousands of lines of code."
  ),
  new Tech(
    "NextJS",
    "next",
    2022,
    "My experience with Next is almost entirely creating web-stores. I also contributed to modernizing existing .Net-based microsites to Next. While it can be somewhat complicated to deploy a Next project on on-premise infrastructure, it is very easy to onboard an existing React team to work with Next and that can be a life-saver when working under tight deadlines."
  ),
  new Tech(
    "Astro",
    "astro",
    2022,
    "This website is built with Astro and I love it! Astro is similar to Next, in the sence that it allows mixing of server-rendered code and React client components, but Astro comes with the added benefit of being able to use any of the popular frameworks (besides Angular) out-of-the-box. It also has many additional integrations, most notably a .MDX to HTML integration which is really cool for cases where documentation has to be maintained without tools like Confluence."
  ),
  new Tech(
    "React Native / Expo",
    "expo",
    2021,
    "I've delievered small- to medium-scale mobile apps and in each case they leveraged the Expo tooling to build and deploy React Native code to the relevant stores. Additionally, I've implemented proprietary AI-models with TensorFlowJS for user identity verification."
  ),
  new Tech(
    "Ionic",
    "ionic",
    2022,
    "Ionic is my favorite framework for developing mobile-first projects. While I have more experience using React Native, I find Ionic to be more dev-friendly and it's much easier to concurrently work on both a mobile and a PC versions."
  ),
  new Tech(
    "Github",
    "github",
    2021,
    "My experience with Github includes managing releases for company products, implementing workflows and using git hooks."
  ),
  new Tech(
    "Cucumber (Gherkin)",
    "cucumber",
    2022,
    "BDD/TDD is a life-saver when managing a medium to large development teams. Complex products exponentially create venues for bugs to exist, and very quickly it becomes impossible to manually QA everything. Cucumber/Gherkin not only provides a way to present the dev processes to non-tech stakeholders, but it also enables structuring and reusing testing code which saves a ton of time."
  ),
  new Tech(
    "Cypress",
    "cypress",
    2021,
    "Cypress is my favorite UI/e2e testing library. While the Cypress cloud/dashboard service tends to be a point of debate in terms of cost efficiency and features, the underlying library is the most dev-friendly way to write tests in my opinion. Thankfully, there are open-source alterinatives to hook up the test suite to, e.g. Sorry Cypress, but they do require some finicking work on the devOps side."
  ),
  new Tech(
    "Jest / Vitest",
    "jest",
    2020,
    "Jest is the unit testing library of choice. While I'm a fan of more holistic approaches to testing (Cypress in a TDD/BDD context) Jest/Vitest are still very important when it comes to projects that require a lot of reusable components to be written. In recent years, I've mostly used Jest to cover back-end functionalities."
  ),
  new Tech(
    "Angular",
    "angular",
    2022,
    "My experience with Angular is mostly extending legacy features in established codebases. While React is my first choice when it comes to large and complex projects, I'm very comfortable coding in Angular."
  ),
  new Tech(
    "Vue",
    "vue",
    2022,
    "I've used Vue on both personal and legacy company projects. I am a big fan of the Compositions API (setup components) and using signals for reactivity. The page you are currently on is made in Vue 3."
  ),
  new Tech(
    "Svelte",
    "svelte",
    2022,
    "Svelte is the most loved front-end framework and there are reasons why. Personally, I see it as being similar to React with 70% less boilerplate. Sadly, despite its passionate community, it also lacks the ecosystems of either React or Angular. With its recent addition of in-built animation events, it's been my prime choice for personal projects involving visually heavy designs."
  ),
  new Tech(
    "Prisma",
    "prisma",
    2022,
    "I fell in love with Prisma the first time I used it for creating server-side functions on a NextJS project. While it is often seen as a tool that enables front-end developers to write simple database interactions, it is powerful and efficient enough to be used on large enterprise projects."
  ),
  new Tech(
    "NodeJS",
    "node",
    2020,
    "NodeJS is an integral part of any JS/TS project, regardless of scale and chosen frameworks. I have used Node from installing NPM packages and running build scripts to writing my own multiplex dev servers."
  ),
  new Tech(
    "NestJS",
    "nest",
    2023,
    "NestJS is sometimes referred to as the Angular for back-end development, and it does live up to that. It is fast, provides out-of-the-box integration with Swagger / Nodemon / Jest and can be a great tool when trying to onboard developers from different back-end stacks into a Typescript project. My experience with this framework is through a medium-sized project for my current company, which is powered by React on the FE and Nest on the BE."
  ),
  new Tech(
    "Vite",
    "vite",
    2021,
    "Vite is the tooling of choice whenever I work on anything front-end related."
  ),
  new Tech(
    "ActionScript / Flash",
    "actionscript",
    2006,
    "This is where my journey into programming started. As I was growing up, I fell in love with the quirky Flash games and animations (especially the stickman vs the creator series) and I just had to learn to do that. While, admittedly, my games never made it to the front page of Kongregate, I learned a lot about coding by trying to reproduce some of the cool things others did. I earned my first IT paycheck with ActionScript by making a bunch of interactive banners."
  ),
];
