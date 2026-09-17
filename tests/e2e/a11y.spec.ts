import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// accessibility-plan.md §9: every route, axe 0 violations, light + dark.
const routes = [
  "/",
  "/work",
  "/work/northwind-checkout",
  "/writing",
  "/writing/on-simplifying-dashboards",
  "/writing/checkout-is-a-form-problem",
  "/about",
  "/services",
  "/contact",
  "/now",
  "/uses",
  "/resume",
  "/photography",
  "/life",
  "/ideas",
];

for (const route of routes) {
  test(`axe: ${route} (light)`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test(`axe: ${route} (dark)`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("axe: 404 page", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
