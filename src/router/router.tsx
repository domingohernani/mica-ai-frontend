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
import OrganizationTeam from "@/features/orgnanization/pages/organization-team";

// Process
import ProcessConfigPage from "@/features/process/pages/process-config.page";

// Interview
import InterviewPage from "@/features/interview/pages/interview.page";

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
        path: "interview",
        element: <InterviewPage />,
      },
      {
        path: "app",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate to="/app/talent-acquisition/candidates" replace />
            ),
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
            path: "process",
            children: [
              {
                path: "config",
                element: <ProcessConfigPage />,
              },
            ],
          },
          {
            path: "organization",
            children: [
              {
                path: "team",
                element: <OrganizationTeam />,
              },
            ],
          },
          {
            path: "*",
            element: (
              <Navigate to={"/app/talent-acquisition/candidates"} replace />
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
