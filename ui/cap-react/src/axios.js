import axios from "axios";

const apiClient = axios.create();

if (!process.env.DOCKER && process.env.NODE_ENV != "production") {
  // Request interceptor to change URL
  apiClient.interceptors.request.use(
    config => {
      if (config.url.startsWith("http://localhost:5000/api")) {
        // Change the URL to relative
        config.url = config.url.replace("http://localhost:5000", "");
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
}

export default apiClient;
