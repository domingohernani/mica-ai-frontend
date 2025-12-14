import App from "@/App";
import CallbackPage from "@/features/auth/pages/callback-page";
import LoginPage from "@/features/auth/pages/login-page";
import SignupPage from "@/features/auth/pages/signup-page";
import OnboardPage from "@/features/orgnanization/pages/onboard-page";
import MainLayout from "@/layout/main-layout";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "onboard",
        element: <OnboardPage />,
      },
      {
        path: "callback",
        element: <CallbackPage />,
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [],
      },
    ],
  },
]);

export default router;
