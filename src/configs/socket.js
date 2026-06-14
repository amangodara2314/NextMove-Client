import { io } from "socket.io-client";
import apiBaseUrl from "../constants/env";
import Cookies from "js-cookie";

const socketUrl = new URL(apiBaseUrl).origin;

const socket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  const token = Cookies.get("accessToken");

  if (!token) return;

  socket.auth = {
    token,
  };

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
