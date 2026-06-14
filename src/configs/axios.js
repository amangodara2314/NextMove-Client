import axios from "axios";
import apiBaseUrl from "../constants/env";
import Cookies from "js-cookie";
import endpoints from "../constants/endpoints";
import { getResponseData } from "../utils/responseHelpers";

let isRefreshing = false;
let refreshPromise = null;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // to send the refreshToken stored in httpOnly cookies
});

// Request interceptors

api.interceptors.request.use(
  (request) => {
    console.log("making a request to this url :", request.url);
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== endpoints.auth.REFRESH_TOKEN
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          refreshPromise = api
            .get(endpoints.auth.REFRESH_TOKEN)
            .then((result) => {
              const data = getResponseData(result);
              const newAccessToken = data.accessToken;

              Cookies.set("accessToken", newAccessToken, { expires: 7 });

              return newAccessToken;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (error) {
        Cookies.remove("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
