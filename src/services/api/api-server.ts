import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";
import axios from "axios";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const apiServer = axios.create({
    baseURL: "http://localhost:5000/", // ajuste se necessário
    withCredentials: true, // envia cookies no backend
});

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/scheduling"];

apiServer.interceptors.request.use(
    async (config) => {
        const session = await getIronSession<SessionData>(
            await cookies(),
            sessionOptions
        );

        const isPublicRoute = PUBLIC_ROUTES.some(
            (route) => config.url === route
        );

        if (isPublicRoute) {
            return config;
        }

        if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
            return config;
        }

        return Promise.reject({
            response: {
                status: 401,
                data: { message: "Unauthorized (sem token)" },
            },
        });
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiServer.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export { apiServer };
