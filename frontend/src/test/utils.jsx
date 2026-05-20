import { render as renderBase } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../store/AuthContext";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const AllProviders = ({ children, initialRoute = "/" }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Re-export everything from Testing Library so test files only need
// to import from this file — no juggling two import sources.
export * from "@testing-library/react";

export const render = (ui, { initialRoute, ...options } = {}) =>
  renderBase(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialRoute={initialRoute}>{children}</AllProviders>
    ),
    ...options,
  });
