import axios from "axios";

const API_TIMEOUT = 1 * 60 * 1000;
const BE_URL = "http://localhost:3000";

/**
 * Istanza di axios per le API di base
 */
export const axiosBase = axios.create({
  baseURL: `${BE_URL}/api/v1`,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosBase.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);
axiosBase.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
