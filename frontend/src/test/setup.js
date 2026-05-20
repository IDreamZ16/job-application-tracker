import "@testing-library/jest-dom";
import { server } from "./server";

// Start the MSW server before all tests. 'warn' surfaces unhandled
// requests in the console without failing the test
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset any handlers added inside individual tests, and clear
// localStorage so auth tokens don't bleed between test cases.
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});

// Shut down the server cleanly after the suite finishes.
afterAll(() => server.close());
