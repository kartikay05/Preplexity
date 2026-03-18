import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { ToastProvider } from "./ToastProvider.jsx";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
};

export default App;