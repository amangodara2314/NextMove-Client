import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return <RouterProvider router={router} />;
}
