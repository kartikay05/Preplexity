import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import Dashboard from "../features/chat/paegs/Dashboard";
import Public from "../features/auth/components/Public";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
    //   <Public>
        <Login />
    //   </Public>
    ),
  },
  {
    path: "/register",
    element: (
      <Public>
        <Register />,
      </Public>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />,
  },
]);
