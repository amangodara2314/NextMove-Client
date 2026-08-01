import { io } from "socket.io-client";
import apiBaseUrl from "../constants/env";
import Cookies from "js-cookie";

const socketUrl = new URL(apiBaseUrl).origin;

const socket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket"],
  upgrade: false,
});

socket.io.on("reconnect_attempt", () => {
  const token = Cookies.get("accessToken");
  if (token) socket.auth = { token };
});

export const connectSocket = () => {
  const token = Cookies.get("accessToken");

  if (!token) return;

  socket.auth = {
    token,
  };

  if (!socket.connected) {
    socket.connect();
    console.log("Connecting to socket server...");
  }
};

export const disconnectSocket = () => {
  console.log("disconnecting from socket server...");
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
