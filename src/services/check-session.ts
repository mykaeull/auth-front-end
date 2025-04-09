import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { apiServer } from "@/services/api/api-server";
import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";

export async function checkValidSession(): Promise<boolean> {
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );

    if (!session.token) return false;

    try {
        await apiServer.get("/auth/me", {
            headers: {
                Cookie: `jwt=${session.token}`,
            },
        });
        return true;
    } catch {
        session.destroy();
        return false;
    }
}
