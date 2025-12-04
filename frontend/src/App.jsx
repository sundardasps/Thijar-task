import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

// Optional: if you put ErrorBoundary in its own file
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import { ProductProvider } from "./context/ProductContext";

// ---- React Query Client (API cache / server state) ----
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <div className="min-h-screen">
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="flex h-screen items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-sky-500" />
                    </div>
                  }
                >
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </div>
          </ProductProvider>
        </AuthProvider>

        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
