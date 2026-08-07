import Cookies from "js-cookie";
import socket from "../configs/socket";
import api from "../configs/axios";
import { getResponseData } from "./responseHelpers";

let refreshPromise = null;

const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .get(endpoints.auth.REFRESH_TOKEN)
      .then((res) => {
        const accessToken = getResponseData(res).accessToken;

        Cookies.set("accessToken", accessToken);

        store.dispatch(setAccessToken(accessToken));

        socket.auth = { token: accessToken };

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const emitWithAuth = (event, data, callback) => {
  const emit = () => {
    socket.emit(event, data, async (response) => {
      if (response?.code === "TOKEN_EXPIRED") {
        try {
          await refreshToken();

          socket.disconnect();

          socket.once("connect", () => {
            emit();
          });

          socket.connect();
        } catch (err) {
          store.dispatch(logout());

          callback?.({
            success: false,
            message: "Authentication failed",
          });
        }

        return;
      }

      callback?.(response);
    });
  };

  emit();
};
