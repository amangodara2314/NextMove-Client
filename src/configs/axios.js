import axios from "axios";
import apiBaseUrl from "../constants/env";
import Cookies from "js-cookie";
console.log(apiBaseUrl);
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

export default api;
