import { createBrowserRouter, type RouteObject } from "react-router-dom";
import SignIn from "../pages/auth/SignInPage";
import SignUp from "../pages/auth/SignUpPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import LandingPage from "../pages/common/LandingPage";
import DashboardPage from "../pages/user/DashboardPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { PublicRoute } from "../hoc/PublicRoute";
import AppShell from "../components/layouts/AppShell";
import ProjectsPage from "../pages/user/ProjectsPage";
import ProjectDetailsPage from "../pages/user/ProjectDetailsPage";
import SettingsPage from "../pages/user/SettingsPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import AnalyticsPage from "../pages/user/AnalyticsPage";
export const UserRoutes: RouteObject[] = [
  {
    path: "",
    element: <LandingPage/>
  },

  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "projects", element: <ProjectsPage /> },
          { path: "projects/:id", element: <ProjectDetailsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
        ]
      }
    ],
  },

  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(UserRoutes);
