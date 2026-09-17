import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(
    results.violations.filter(({ impact }) =>
      ["serious", "critical"].includes(impact ?? "")
    )
  ).toEqual([]);
}

test.describe("routing and progressive enhancement", () => {
  test("uses the lightweight home fallback on compact viewports", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    const requestedScripts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") requestedScripts.push(request.url());
    });

    await page.goto("/");

    await expect(page.getByTestId("home-fallback")).toBeVisible();
    await expect(page.locator("#home-scene canvas")).toHaveCount(0);
    expect(requestedScripts.some((url) => url.includes("mountHome"))).toBe(false);
  });

  test("loads the interactive 3D home scene on standard desktops", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const requestedScripts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") requestedScripts.push(request.url());
    });

    await page.goto("/");

    const canvas = page.locator("#home-scene canvas");
    await expect(canvas).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("home-fallback")).toBeHidden();
    expect(requestedScripts.some((url) => url.includes("mountHome"))).toBe(true);

    await page.mouse.move(720, 450);
    const centeredFrame = await canvas.screenshot();
    await page.mouse.move(1_000, 450, { steps: 8 });
    await page.waitForTimeout(100);
    const movedFrame = await canvas.screenshot();
    expect(movedFrame.equals(centeredFrame)).toBe(false);
  });

  test("normalizes slash variants and keeps root-relative assets working", async ({
    page,
  }) => {
    const failedAssets: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) failedAssets.push(response.url());
    });

    await page.goto("/projects/");
    const projectImage = page.locator(".project-img").first();
    await expect(projectImage).toHaveAttribute(
      "style",
      /\/projects\/portfolio2023\.jpg/
    );

    await page.goto("/stack/");
    await expect(page.getByRole("button", { name: /Typescript/ })).toBeVisible();
    await expect(page.locator('.icon-btn-cont img[src="/icons/ts.png"]')).toHaveCount(1);

    await page.getByRole("button", { name: "About this page" }).click();
    await expect(page.getByRole("dialog")).toContainText("Vue 3");
    const infoPanel = page.locator("#info-cont .info-shown");
    await expect(infoPanel).toHaveCSS(
      "transition-duration",
      "0.36s, 0.36s, 0.36s",
    );

    const closeStartedAt = Date.now();
    await page.getByRole("button", { name: "Close page information" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(Date.now() - closeStartedAt).toBeGreaterThanOrEqual(300);
    expect(failedAssets).toEqual([]);
  });

  test("exposes project destinations as real links", async ({ page }) => {
    await page.goto("/projects");

    const firstProjectLinks = page.locator(".single-project .links").first();
    const sourceLink = firstProjectLinks.locator('a:has-text("Source")');
    const websiteLink = firstProjectLinks.locator('a:has-text("Website")');
    await expect(sourceLink).toHaveAttribute("href", /^https:\/\//);
    await expect(sourceLink).toHaveAttribute("rel", /noopener/);
    await expect(websiteLink).toHaveAttribute("href", /^https:\/\//);
  });

  test("fades project sections into view while scrolling", async ({ page }) => {
    await page.goto("/projects");

    const firstProject = page.locator('.single-project[data-id="0"]');
    const description = firstProject.locator(".body");
    await expect(description).toHaveCSS("opacity", "0");
    await expect(description).toHaveCSS("transition-property", /opacity/);
    await expect(description).toHaveCSS("transition-duration", /^0\.35s/);

    await description.scrollIntoViewIfNeeded();

    await expect(description).toHaveCSS("opacity", "1");
    await expect(description).toHaveCSS("transition-duration", /^0\.75s/);
  });

  test("prefetches and preserves framework pages across navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1800, height: 900 });
    await page.goto("/projects");

    const activeProjectLink = page.getByRole("link", { name: "Projects" });
    await expect(activeProjectLink).toHaveAttribute("aria-current", "page");
    await expect(activeProjectLink.locator(".label")).toHaveCSS(
      "animation-name",
      "menu-label-glow",
    );
    await expect(activeProjectLink.locator(".label")).toHaveCSS(
      "text-shadow",
      /rgb\(255, 255, 255\)/,
    );
    await expect(activeProjectLink.locator(".label")).toHaveCSS(
      "filter",
      "none",
    );
    await expect
      .poll(() =>
        activeProjectLink.locator(".before").evaluate((marker) =>
          getComputedStyle(marker, "::after").getPropertyValue("opacity"),
        ),
      )
      .toBe("1");
    await expect
      .poll(() =>
        activeProjectLink.locator(".before").evaluate((marker) =>
          getComputedStyle(marker, "::after").getPropertyValue("box-shadow"),
        ),
      )
      .toBe("none");

    const stackLink = page.getByRole("link", { name: "Stack" });
    await expect(stackLink).toHaveAttribute("data-astro-prefetch", "");
    await stackLink.click();
    await expect(page).toHaveURL(/\/stack$/);
    await expect(page.getByRole("button", { name: /Typescript/ })).toBeVisible();

    await page.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByLabel("Name")).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/stack$/);
    await expect(page.getByRole("button", { name: /Typescript/ })).toBeVisible();
  });

  test("opens and closes stack details from the keyboard", async ({ page }) => {
    await page.goto("/stack");

    const typescript = page.getByRole("button", { name: /Typescript/ });
    await typescript.focus();
    await page.keyboard.press("Enter");

    const returnButton = page.getByRole("button", {
      name: "Return to the technology list",
    });
    await expect(returnButton).toBeVisible({ timeout: 3_000 });
    await expect(page.getByText("Experience since:")).toBeVisible();

    await returnButton.click();
    await expect(typescript).toBeVisible();
  });

  test("mobile navigation opens, identifies the current page, and closes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto("/projects/");

    const openMenu = page.getByRole("button", { name: "Open navigation menu" });
    await expect(openMenu).toBeVisible();
    await expect(openMenu).toHaveCSS("z-index", "4900");
    await expect(openMenu.locator("svg")).toHaveCSS("transform", "none");

    const menuButtonBox = await openMenu.boundingBox();
    const menuIconBox = await openMenu.locator("svg").boundingBox();
    expect(menuButtonBox).not.toBeNull();
    expect(menuIconBox).not.toBeNull();
    expect(menuIconBox!.width).toBeLessThan(menuButtonBox!.width);
    expect(menuIconBox!.height).toBeLessThan(menuButtonBox!.height);

    const menuButtonIsOnTop = await page.evaluate(({ x, y }) => {
      return Boolean(
        document
          .elementFromPoint(x, y)
          ?.closest('button[aria-label="Open navigation menu"]'),
      );
    }, {
      x: menuButtonBox!.x + menuButtonBox!.width / 2,
      y: menuButtonBox!.y + menuButtonBox!.height / 2,
    });
    expect(menuButtonIsOnTop).toBe(true);

    await openMenu.click();

    await expect(page.locator(".menu-shown")).toBeVisible();
    await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
    await page.getByRole("button", { name: "Close navigation menu" }).click();
    await expect(page.locator(".menu-shown")).toHaveCount(0);
  });
});

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact/");
    await expect(page.getByLabel("Name")).toBeVisible();
  });

  test("prevents invalid submissions", async ({ page }) => {
    let requestCount = 0;
    await page.route("**/api/v1.0/email/send", async (route) => {
      requestCount += 1;
      await route.fulfill({ status: 200, body: "OK" });
    });

    const sendButton = page.getByRole("button", { name: "Send" });
    await expect(sendButton).toBeDisabled();
    await page.getByLabel("Subject").press("Enter");
    await page.waitForTimeout(100);

    expect(requestCount).toBe(0);
    await expect(page.getByText("Email sent")).toHaveCount(0);
  });

  test("keeps the form visible and reports delivery failures", async ({ page }) => {
    await page.route("**/api/v1.0/email/send", async (route) => {
      await route.fulfill({ status: 500, body: "Failure" });
    });

    await page.getByLabel("Name").fill("Portfolio Reviewer");
    await page.getByLabel("Email").fill("reviewer@example.com");
    await page.getByLabel("Subject").fill("Portfolio review");
    await page
      .getByLabel("Message")
      .fill("This test message contains more than thirty characters.");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByRole("alert")).toContainText("could not be sent");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByText("Email sent")).toHaveCount(0);
  });

  test("shows success only after successful delivery", async ({ page }) => {
    let finishDelivery: (() => void) | undefined;
    const deliveryPending = new Promise<void>((resolve) => {
      finishDelivery = resolve;
    });

    await page.route("**/api/v1.0/email/send", async (route) => {
      await deliveryPending;
      await route.fulfill({ status: 200, body: "OK" });
    });

    await page.getByLabel("Name").fill("Portfolio Reviewer");
    await page.getByLabel("Email").fill("reviewer@example.com");
    await page.getByLabel("Subject").fill("Portfolio review");
    await page
      .getByLabel("Message")
      .fill("This test message contains more than thirty characters.");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByRole("button", { name: "Sending" })).toBeDisabled();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByText("Email sent")).toHaveCount(0);

    finishDelivery?.();
    await expect(page.getByRole("status")).toContainText("Email sent");
    await expect(page.getByLabel("Name")).toHaveCount(0);
  });
});

test.describe("accessibility", () => {
  for (const route of ["/", "/projects", "/stack", "/contact"]) {
    test(`${route} has no serious automated accessibility violations`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route);
      await expect(page.locator(".spinner")).toBeHidden();
      await expectNoSeriousAccessibilityViolations(page);
    });
  }
});
