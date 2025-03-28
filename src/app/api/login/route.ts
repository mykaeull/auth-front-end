import { NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await apiServer.post("/auth/login", body);

        // Apenas retorna os dados recebidos do backend (ex: usuário logado)
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("[LOGIN_ERROR]", error);
        return NextResponse.json(
            { message: "Erro ao fazer login" },
            { status: 500 }
        );
    }
}
