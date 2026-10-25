import { expect, test } from "@playwright/test";

const routes = [
  "/", "/courses", "/schedule", "/ap-classes", "/gpa", "/profile",
  "/signup", "/login", "/goals", "/compass", "/submit-info",
  "/test-prep", "/opportunities", "/resume-maker",
];

async function mockBackend(page) {
  await page.route("**/auth/v1/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );
  await page.route("**/rest/v1/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "content-range": "0-0/0" },
      body: "[]",
    })
  );
  await page.route("**/rest/v1/rpc/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" })
  );
  await page.addInitScript(() => {
    window.print = () => {};
  });
}

test.beforeEach(async ({ page }) => {
  await mockBackend(page);
  page.on("dialog", (dialog) => dialog.accept("Playwright sample"));
});

test("all app routes load and every initial visible button can be clicked", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
    const buttonCount = await page.locator("button:visible").count();

    for (let index = 0; index < buttonCount; index += 1) {
      // Reload before each click so one button's state change cannot hide or
      // reorder another button in the same page's inventory.
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const button = page.locator("button:visible").nth(index);
      await expect(button, `${route}: visible button ${index + 1}`).toBeVisible();
      await expect(button, `${route}: button ${index + 1} needs an accessible name`)
        .toHaveAccessibleName();
      if (await button.isDisabled()) continue;
      await button.click();
      await expect(page.locator("body")).not.toBeEmpty();
    }
  }

  expect(pageErrors).toEqual([]);
});

test("home pillars lead to the matching guides", async ({ page }) => {
  await page.goto("/");
  const pillars = [
    ["Plan", "/schedule", "Schedule Guide"],
    ["Pursue", "/opportunities", "Extracurriculars Guide"],
    ["Present", "/resume-maker", "Resume Maker"],
    ["Prepare", "/test-prep", "ACT and PSAT Test Prep"],
  ];

  for (const [label, path, heading] of pillars) {
    await page.goto("/");
    await page.getByRole("link", { name: new RegExp(label) }).click();
    await expect(page).toHaveURL(new RegExp(`${path.replaceAll("/", "\/")}$`));
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
  }
});

test("opportunity guides expand and test prep tabs switch panels", async ({ page }) => {
  await page.goto("/opportunities");
  const competitions = page.getByRole("button", { name: /competitions & challenges/i });
  await competitions.click();
  await expect(competitions).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/competitions can give you a reason/i)).toBeVisible();

  await page.goto("/test-prep");
  await page.getByRole("button", { name: "PSAT calculator" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("PSAT/NMSQT");
  await page.getByRole("button", { name: "Selection Index" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Selection Index");
});

test("resume maker controls update its preview", async ({ page }) => {
  await page.goto("/resume-maker");
  await page.getByRole("button", { name: "View example resume" }).click();
  await expect(page.getByText(/Example loaded/)).toBeVisible();
  await expect(page.locator("#resume-paper h1")).not.toHaveText("Your Name");
  await page.getByRole("button", { name: "Start from scratch" }).click();
  await expect(page.locator("#resume-paper")).toContainText("Your Name");
  await page.getByRole("button", { name: /Add activity/ }).first().click();
  await expect(page.locator("#resume-paper")).toBeVisible();
});

test("compass selection and focus timer controls respond", async ({ page }) => {
  await page.goto("/compass");
  await page.getByRole("button", { name: /Enter Compass/ }).click();
  const mars = page.getByRole("button", { name: "Select Mars" });
  await mars.click();
  await expect(mars).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Reveal focus duration for Mars/ }).click();
  await expect(page.getByText("40")).toBeVisible();
  await page.getByRole("button", { name: /Focus here/ }).click();
  await expect(page.getByRole("button", { name: /Close focus timer/ })).toBeVisible();
  const constellation = page.getByRole("button", { name: "Constellation" });
  await constellation.click();
  await expect(constellation).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Close focus timer/ }).click();
  await expect(page.getByRole("heading", { name: /Choose your orbit/ })).toBeVisible();
});
