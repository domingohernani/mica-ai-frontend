import App from "@/App";
import MainLayout from "@/layout/main.layout";

// Auth Routes
import CallbackPage from "@/features/auth/pages/callback-page";
import LoginPage from "@/features/auth/pages/login-page";
import SignupPage from "@/features/auth/pages/signup-page";

// Hiring Routes
import HiringCandidatesPage from "@/features/hiring/pages/hiring-candidates.page";
import HiringInterviewResultsPage from "@/features/hiring/pages/hiring-interview-results.page";
import HiringJobPostingPage from "@/features/hiring/pages/hiring-job-postings.page";

// Organization Routes
import OnboardPage from "@/features/orgnanization/pages/onboard-page";

// Others
import { createBrowserRouter, Navigate } from "react-router-dom";

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
        children: [
          {
            index: true,
            element: <Navigate to="/talent-acquisition/candidates" replace />,
          },
          {
            path: "talent-acquisition",
            children: [
              {
                path: "candidates",
                element: <HiringCandidatesPage />,
              },
              {
                path: "results",
                element: <HiringInterviewResultsPage />,
              },
              {
                path: "jobs",
                element: <HiringJobPostingPage />,
              },
            ],
          },
          {
            path: "*",
            element: <Navigate to={"/hiring/candidates"} replace />,
          },
        ],
      },
    ],
  },
]);

export default router;
