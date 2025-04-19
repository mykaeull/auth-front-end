import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function POST() {
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );

    session.destroy();
    return Response.redirect(new URL("/login", process.env.FRONTEND_API_URL));
}
