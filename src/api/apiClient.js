import axios from "axios";

export const jikanClient = axios.create({
    baseURL: process.env.REACT_APP_JIKAN_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  jikanClient.interceptors.request.use(async (config) => {
    return config
  });

  jikanClient.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response;
    }
  );

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosClient.interceptors.request.use(async (config) => {
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response;
    }
  );
