import axios from "axios";

const apiServer = axios.create({
    baseURL: "http://localhost:5000/", // ajuste se necessário
    withCredentials: true, // envia cookies no backend
});

export { apiServer };
