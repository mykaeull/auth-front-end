import { NextRequest, NextResponse } from "next/server";
import { checkValidSession } from "./services/check-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./lib/utils/iron-sesison";

export async function middleware(request: NextRequest) {
    const isLoggedIn = await checkValidSession();

    if (
        !isLoggedIn &&
        (request.nextUrl.pathname === "/" ||
            request.nextUrl.pathname === "/agendamentos")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        isLoggedIn &&
        (request.nextUrl.pathname === "/" ||
            request.nextUrl.pathname === "/login" ||
            request.nextUrl.pathname === "/register")
    ) {
        const session = await getIronSession<SessionData>(
            await cookies(),
            sessionOptions
        );

        session.destroy();

        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next(); // continua normalmente
}

export const config = {
    matcher: ["/", "/agendamentos", "/login", "/register"], // você pode adicionar mais rotas privadas aqui
};
