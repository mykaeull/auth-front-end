import { NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";
import { AxiosError } from "axios";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const session = await getIronSession<SessionData>(
            await cookies(),
            sessionOptions
        );

        const response = await apiServer.post("/auth/login", body);

        const user = response.data;

        const jwtCookie = response.headers["set-cookie"]?.find(
            (cookie: string) => cookie.startsWith("jwt=")
        );

        if (jwtCookie) {
            const [cookieValue] = jwtCookie.split(";");
            const [, token] = cookieValue.split("=");

            session.token = token;
            session.id = user.id;
            session.name = user.name;
            session.email = user.email;
            await session.save();
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || "Erro inesperado";

            return NextResponse.json({ message }, { status });
        }

        console.error("[LOGIN_ERROR]", error);
        return NextResponse.json({ message: "Erro interno" }, { status: 500 });
    }
}
