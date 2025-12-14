import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import router from "./router/router.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env["VITE_AUTH0_DOMAIN"]}
      clientId={import.meta.env["VITE_AUTH0_CLIENT_ID"]}
      authorizationParams={{
        redirect_uri: import.meta.env["VITE_AUTH0_REDIRECT_URI"],
        audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
        scope: "openid profile email offline_access",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>
);
