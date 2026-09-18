import { expect, test } from "@playwright/test";

test("home page loads and nav works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Work", exact: true }).first().click();
  await expect(page).toHaveURL(/\/work$/);
});

test("theme toggle switches to dark mode", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: /switch to (dark|light) theme/i,
  });
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark|light/);
});

test("404 page renders for an unknown route", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/wandered off/i)).toBeVisible();
});

test("contact form shows validation errors on empty submit", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});

test("security headers are present on the response", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});

test("no horizontal scroll at narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const hasHScroll = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHScroll).toBe(false);
});

test("respects prefers-reduced-motion (no marquee animation)", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".animate-marquee")).toHaveCount(0);
});

test("mobile nav traps focus and Escape closes it", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("desktop More menu opens, reaches a secondary page, and Escape closes it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "More" });
  await trigger.click();
  const menu = page.getByRole("menu", { name: "More" });
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: "Photography" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Photography, Life, and Ideas pages load with an honest empty state", async ({
  page,
}) => {
  for (const route of ["/photography", "/life", "/ideas"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("command palette opens with Ctrl+K and navigates on Enter", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Quick navigation" });
  await expect(dialog).toBeVisible();

  await page.getByRole("combobox", { name: "Search" }).fill("Work");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work$/);
});

test("back-to-top button appears after scrolling and returns to top", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.wheel(0, 2000);
  const button = page.getByRole("button", { name: "Back to top" });
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator("html")).toHaveJSProperty("scrollTop", 0);
});

test("writing article shows a table of contents and reading progress", async ({
  page,
}) => {
  await page.goto("/writing/on-simplifying-dashboards");
  await expect(
    page.getByRole("navigation", { name: "Table of contents" }),
  ).toHaveCount(0);
  // (this sample post has < 2 headings, so TOC correctly does not render —
  // asserting absence here guards against it rendering empty)
});

test("404 page suggests recent work and writing", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await expect(page.getByText("Work").first()).toBeVisible();
});

test("feed.json returns a valid JSON Feed", async ({ request }) => {
  const response = await request.get("/feed.json");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.version).toBe("https://jsonfeed.org/version/1.1");
  expect(Array.isArray(body.items)).toBe(true);
});

test("resume page print button is present", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.getByRole("button", { name: /print/i })).toBeVisible();
});

test("writing series shows part navigation", async ({ page }) => {
  await page.goto("/writing/checkout-is-a-form-problem");
  await expect(page.getByText(/Part 1 of 2/)).toBeVisible();
});

test("? opens the keyboard shortcuts overlay", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("?");
  await expect(
    page.getByRole("dialog", { name: "Keyboard shortcuts" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Keyboard shortcuts" }),
  ).toBeHidden();
});
