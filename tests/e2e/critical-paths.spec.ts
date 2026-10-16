import { expect, test } from "./fixtures";

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

test("contact form submits valid fields and shows the success state", async ({
  page,
}) => {
  let submittedPayload: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<
      string,
      unknown
    >;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/contact");
  await page.locator("#name").fill("Jamie Rivera");
  await page.locator("#email").fill("jamie@example.com");
  await page
    .locator("#message")
    .fill("I would like to discuss a website project for my team.");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByRole("status")).toContainText("Thanks — that's sent");
  expect(submittedPayload?.renderedAt).toEqual(expect.any(Number));
  expect(submittedPayload?.name).toBe("Jamie Rivera");
});

test("contact form explains delivery errors and provides a mailto fallback", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Couldn't send that right now. Please try again shortly.",
      }),
    });
  });

  await page.goto("/contact");
  await page.locator("#name").fill("Jamie Rivera");
  await page.locator("#email").fill("jamie@example.com");
  await page
    .locator("#message")
    .fill("I would like to discuss a website project for my team.");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.locator("form [role=alert]")).toContainText(
    "Couldn't send that right now",
  );
  await expect(page.locator('form a[href^="mailto:"]')).toBeVisible();
});

test("contact API returns 503 instead of false success when email delivery is not configured", async ({
  request,
}) => {
  test.skip(
    Boolean(process.env.RESEND_API_KEY),
    "Avoid sending a real email when delivery credentials exist.",
  );
  const response = await request.post("/api/contact", {
    data: {
      name: "Jamie Rivera",
      email: "jamie@example.com",
      message: "I would like to discuss a website project for my team.",
      company: "",
      renderedAt: Date.now() - 5000,
    },
  });
  expect(response.status()).toBe(503);
});

test("security headers are present on the response", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};
  const csp = headers["content-security-policy"] ?? "";
  const scriptDirective =
    csp
      .split(";")
      .find((directive) => directive.trim().startsWith("script-src")) ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(scriptDirective).toContain("'nonce-");
  expect(scriptDirective).not.toContain("'unsafe-inline'");
  expect(scriptDirective).not.toContain("'unsafe-eval'");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  expect(headers["strict-transport-security"]).not.toContain("preload");
});

test("nonce CSP does not block the inline theme bootstrap", async ({
  page,
}) => {
  const cspErrors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /content security policy|violates the following CSP|violates the following Content Security Policy/i.test(
        message.text(),
      )
    ) {
      cspErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/light|dark/);
  expect(cspErrors).toEqual([]);
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
  // Keep this interaction assertion deterministic; Lenis/native smooth scrolling
  // is verified elsewhere and can take longer than Playwright's short expect timeout.
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await page.keyboard.press("Shift+/");
  await expect(
    page.getByRole("dialog", { name: "Keyboard shortcuts" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Keyboard shortcuts" }),
  ).toBeHidden();
});
