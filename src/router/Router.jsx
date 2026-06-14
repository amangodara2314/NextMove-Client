import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Matchmaking from "../pages/Matchmaking";
import Game from "../pages/Game";

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
          element: <Matchmaking />,
        },
        {
          path: "/game/:gameId",
          element: <Game />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
