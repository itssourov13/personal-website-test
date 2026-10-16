import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    const serverErrors: string[] = [];

    page.on("pageerror", (error) =>
      pageErrors.push(error.stack ?? error.message),
    );
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()}: ${request.failure()?.errorText ?? "failed"}`,
      );
    });
    page.on("response", (response) => {
      if (response.status() >= 500)
        serverErrors.push(`${response.status()} ${response.url()}`);
    });

    // Playwright's fixture `use` is a lifecycle callback, not a React hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      const diagnostics = [
        `Test: ${testInfo.title}`,
        `Expected status: ${testInfo.expectedStatus}`,
        `Actual status: ${testInfo.status}`,
        "",
        "Page errors:",
        ...pageErrors.map((value) => `- ${value}`),
        "",
        "Console errors:",
        ...consoleErrors.map((value) => `- ${value}`),
        "",
        "Failed requests:",
        ...failedRequests.map((value) => `- ${value}`),
        "",
        "HTTP 5xx responses:",
        ...serverErrors.map((value) => `- ${value}`),
      ].join("\n");
      await testInfo.attach("browser-diagnostics.txt", {
        body: Buffer.from(diagnostics),
        contentType: "text/plain",
      });
    }
  },
});

export { expect };
