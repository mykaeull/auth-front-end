import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";
import axios from "axios";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const apiServer = axios.create({
    // baseURL: "http://localhost:5000/", // ajuste se necessário
    baseURL: process.env.API_BASE_URL || "http://backend:5000",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const isPublicRoute = (url: string | undefined) => {
    if (!url) return false;

    const publicRoutes = [
        "/auth/login",
        "/auth/register",
        "/scheduling/available-times",
    ];

    const isExactPublicRoute = publicRoutes.includes(url);
    const isCreateScheduling = /^\/scheduling\/\d+$/.test(url); // Ex: /scheduling/1

    return isExactPublicRoute || isCreateScheduling;
};

apiServer.interceptors.request.use(
    async (config) => {
        const session = await getIronSession<SessionData>(
            await cookies(),
            sessionOptions
        );

        if (isPublicRoute(config.url)) {
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
