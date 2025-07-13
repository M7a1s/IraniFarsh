import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackBarProvider } from "@/context/SnackBarProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { CookiesProvider } from "react-cookie";
import { CartProvider } from "@/context/CartProvider.tsx";
import { HashRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0,
      // cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <SnackBarProvider>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <AuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AuthProvider>
          </CookiesProvider>
        </SnackBarProvider>
      </QueryClientProvider>
    </HashRouter>
  </StrictMode>
);
