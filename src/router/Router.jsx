import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Play from "../pages/Play";

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
        {
          path: "/play",
          element: <Play />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
