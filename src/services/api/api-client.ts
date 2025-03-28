import axios from "axios";

const apiClient = axios.create({
    withCredentials: true, // necessário para envio de cookies para `/api/...`
});

export { apiClient };
