import axios from "axios";
import { URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: URL.BASE_URL,
  timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
    },
});

export default axiosInstance;
