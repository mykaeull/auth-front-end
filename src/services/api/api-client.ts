import axios from "axios";
import { redirect } from "next/navigation";

const apiClient = axios.create({
    // baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            redirect("/logout");
        }

        return Promise.reject(error.response.data);
    }
);

export { apiClient };
