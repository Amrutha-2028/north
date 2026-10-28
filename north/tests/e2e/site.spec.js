import { expect, test } from "@playwright/test";

const routes = [
  "/", "/courses", "/schedule", "/ap-classes", "/gpa",
  "/goals", "/compass", "/submit-info",
  "/test-prep", "/opportunities", "/resume-maker",
];

const mockUser = {
  id: "playwright-student",
  aud: "authenticated",
  role: "authenticated",
  email: "student@example.test",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2026-01-01T00:00:00.000Z",
};

const existingGoal = {
  id: "playwright-goal-1",
  user_id: mockUser.id,
  title: "Build a small app",
  description: "A test-only goal.",
  due_date: null,
  goal_type: "long-term",
  color: "#8FC7F2",
  priority: 0,
  completed: false,
};

async function mockBackend(page) {
  await page.route("**/auth/v1/**", (route) => {
    const isUserRequest = new URL(route.request().url()).pathname.endsWith("/user");
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(isUserRequest ? mockUser : {}),
    });
  });
  await page.route("**/rest/v1/**", (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (pathname.endsWith("/goals") && request.method() === "GET") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([existingGoal]) });
    }
    if (pathname.endsWith("/goals") && request.method() === "POST") {
      const created = { ...request.postDataJSON(), id: "playwright-goal-2" };
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(created) });
    }
    if (pathname.endsWith("/goals") && ["PATCH", "DELETE"].includes(request.method())) {
      return route.fulfill({ status: 204, body: "" });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "content-range": "0-0/0" },
      body: "[]",
    });
  });
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
  test.setTimeout(180_000);
  page.setDefaultTimeout(8_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const route of routes) {
    await page.goto(route, { waitUntil: "commit" });
    await expect(page.locator("body")).toContainText(/.+/);
    const buttonCount = await page.locator("button:visible").count();

    for (let index = 0; index < buttonCount; index += 1) {
      // Reload before each click so one button's state change cannot hide or
      // reorder another button in the same page's inventory.
      await page.goto(route, { waitUntil: "commit" });
      const button = page.locator("button:visible").nth(index);
      await expect(button, `${route}: visible button ${index + 1}`).toBeVisible();
      await expect(button, `${route}: button ${index + 1} needs an accessible name`)
        .toHaveAccessibleName(/.+/);
      if (await button.isDisabled()) continue;
      await button.click();
      await expect(page.locator("body")).toContainText(/.+/);
    }
  }

  expect(pageErrors).toEqual([]);
});

test("home pillars lead to the matching guides", async ({ page }) => {
  await page.goto("/");
  const pillars = [
    ["/schedule", "Schedule Guide"],
    ["/opportunities", "Extracurriculars Guide"],
    ["/resume-maker", "Resume Maker"],
    ["/test-prep", "ACT and PSAT Test Prep"],
  ];

  for (const [path, heading] of pillars) {
    await page.goto("/");
    await page.locator(`a.feature-card[href="${path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
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
  await page.getByRole("tab", { name: "PSAT calculator" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("PSAT/NMSQT");
  await page.getByRole("tab", { name: "Selection Index" }).click();
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
  await expect(page.getByText("40", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Focus here/ }).click();
  await expect(page.getByRole("button", { name: /Close focus timer/ })).toBeVisible();
  const constellation = page.getByRole("button", { name: "Constellation" });
  await constellation.click();
  await expect(constellation).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Begin focus" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("button", { name: "Finish" })).toBeVisible();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByRole("button", { name: /Close focus timer/ }).click();
  await expect(page.getByRole("heading", { name: /Choose your orbit/ })).toBeVisible();
});


test("GPA counters and scale controls update", async ({ page }) => {
  await page.goto("/gpa");
  const firstCounter = page.locator(".gpa-year .counter").first();
  await expect(firstCounter.locator("span")).toHaveText("0");
  await firstCounter.getByRole("button", { name: "+" }).click();
  await expect(firstCounter.locator("span")).toHaveText("1");
  await page.getByRole("button", { name: "Customize My Scale" }).click();
  await expect(page.getByRole("heading", { name: "Customize Your Scale" })).toBeVisible();
  await page.getByRole("button", { name: "Reset to Default" }).click();
});

test("goal form and submission form controls respond without remote writes", async ({ page }) => {
  await page.goto("/goals");
  await page.getByRole("button", { name: /Add Goal/ }).click();
  await expect(page.getByRole("heading", { name: "What are you working toward?" })).toBeVisible();
  const goalColor = page.getByRole("button", { name: "Choose #7DD3A8" });
  await goalColor.click();
  await expect(goalColor).toHaveClass(/selected/);

  await page.goto("/submit-info");
  await page.getByRole("button", { name: /Bug/ }).click();
  await expect(page.getByLabel("TITLE")).toHaveAttribute("placeholder", "What went wrong?");
  await page.getByLabel("TITLE").fill("Playwright test");
  await page.getByLabel("MESSAGE").fill("Automated local browser check.");
  await page.getByRole("button", { name: /Send transmission/ }).click();
  await expect(page.getByRole("heading", { name: "Transmission received." })).toBeVisible();
});
test("goal actions work without an account", async ({ page }) => {
  await page.goto("/");
  await page.goto("/goals");
  await page.getByRole("button", { name: "Add Goal" }).click();
  await page.getByRole("textbox", { name: "Goal" }).fill("Test goal creation");
  await page.getByRole("button", { name: /Add Goal/ }).last().click();
  await expect(page.getByRole("heading", { name: "Test goal creation" })).toBeVisible();

  const goalCard = page.locator(".priority-card").filter({ hasText: "Test goal creation" });
  await goalCard.getByRole("button", { name: "Complete goal" }).click();
  await expect(goalCard).toHaveClass(/completed/);
  await goalCard.getByRole("button", { name: "Delete goal" }).click();
  await expect(page.getByRole("heading", { name: "Build a small app" })).toHaveCount(0);
});
