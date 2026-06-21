import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import { ThemeProvider } from "./components/ThemeProvider";
import { useEffect } from "react";
import socket, { connectSocket, disconnectSocket } from "./configs/socket";
import { Toaster } from "@/components/ui/sonner";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export default function App() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return;
    const handleConnect = () => {
      console.log("Connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.log("Disconnected:", reason);
    };

    connectSocket();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      disconnectSocket();
    };
  }, [accessToken]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="nextmove-ui-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}
