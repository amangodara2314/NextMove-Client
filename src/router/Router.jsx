import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/",
      element: (
        <AuthenticatedLayout>
          <MainLayout />
        </AuthenticatedLayout>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
