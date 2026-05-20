import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Node-based MSW server for Vitest. Intercepts fetch and XHR
// at the Node level so Axios requests are caught without needing
// a real network or a running backend.
export const server = setupServer(...handlers);
