import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:400/api/v1" : "/",
    withCredentials: true,
});
