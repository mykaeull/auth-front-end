import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./lib/utils/iron-sesison";

export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );
    const isLoggedIn = !!session?.token;

    const protectedRoutes = ["/welcome"];

    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (!isLoggedIn && isProtected) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next(); // continua normalmente
}

export const config = {
    matcher: ["/welcome"], // você pode adicionar mais rotas privadas aqui
};
