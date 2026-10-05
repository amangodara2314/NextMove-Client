import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Router from "./router/Router";
import { ThemeProvider } from "./components/ThemeProvider";
import { useEffect } from "react";
import socket, { connectSocket, disconnectSocket } from "./configs/socket";
import { Toaster } from "@/components/ui/sonner";
import { useSelector } from "react-redux";
import { refreshToken } from "./services/auth/authServices";
import { getResponseData } from "./utils/responseHelpers";

export default function App() {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const onConnect = () =>
      console.log("Connected:", socket.id, socket.io.engine.transport.name);
    const onDisconnect = (reason, details) =>
      console.log("Disconnected:", reason, details);
    const onVisible = () => {
      if (!document.hidden && !socket.active) socket.connect();
    };

    const onConnectError = async (err) => {
      console.log("connect_error:", err.message, "active:", socket.active);
      if (!socket.active) {
        const result = await refreshToken();
        console.log("refreshToken result:", result);
        const data = getResponseData(result);
        const newAccessToken = data.accessToken;

        Cookies.set("accessToken", newAccessToken, { expires: 7 });
        socket.connect();
      }
    };

    connectSocket();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      document.removeEventListener("visibilitychange", onVisible);
      disconnectSocket();
    };
  }, [accessToken]);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !socket.connected) {
        console.log("Tab active, forcing socket reconnection...");
        socket.connect();
      }
    });
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider defaultTheme="dark" storageKey="nextmove-ui-theme">
          <Router />
          <Toaster richColors />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}
