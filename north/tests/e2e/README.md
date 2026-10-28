# Browser checks

Install project dependencies once, then install Playwright Chromium:

```sh
npm install
npx playwright install chromium
```

Run the browser suite with:

```sh
npm run test:e2e
```

The suite starts and closes its own Vite server on port 4173 and mocks Supabase requests, so it does not write to a real student account. It visits every app route, clicks each button rendered in the unauthenticated state from a fresh page, and checks the primary interactive flows. Add or update tests in `site.spec.js` when new authenticated or conditional controls are introduced.
