import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  const token = Cookies.get("token");
  if (token && !config.url.includes("/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
