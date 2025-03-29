import axios from "axios";
import { redirect } from "next/navigation";

const apiClient = axios.create({
    withCredentials: true, // necessário para envio de cookies para `/api/...`
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/"
        ) {
            redirect("/logout");
        }

        return Promise.reject(error.response.data);
    }
);

export { apiClient };
