import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import { ThemeProvider } from "./components/ThemeProvider";
import { useEffect } from "react";
import socket, { connectSocket, disconnectSocket } from "./configs/socket";

export default function App() {
  useEffect(() => {
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
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="nextmove-ui-theme">
      <div className="h-full w-full">
        <Router />
      </div>
    </ThemeProvider>
  );
}
