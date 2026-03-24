import { createBrowserRouter, type RouteObject } from "react-router-dom";
import SignIn from "../pages/SignInPage";
import SignUp from "../pages/SignUpPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import { PublicRoute } from "../hoc/PublicRoute";


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
    element: <ProtectedRoute />,
    children: [
        { path: "dashboard", element: <DashboardPage /> },
    ],
  },


  { path: "*", element: <LandingPage /> },
];

export const router = createBrowserRouter(UserRoutes);

