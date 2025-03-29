import { SessionOptions } from "iron-session";

export type SessionData = {
    token: string;
    id: number;
    name: string;
    email: string;
};

export const sessionOptions: SessionOptions = {
    password: process.env.NEXT_PUBLIC_IRON_SESSION_PASSWORD!,
    cookieName: "jwt",
};
