import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const params = Object.fromEntries(searchParams.entries());

    try {
        const { data } = await apiServer.get("/scheduling/all", {
            params,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("[AGENDAMENTOS_API_ERROR]", error);
        return NextResponse.json(
            { message: "Erro ao buscar agendamentos" },
            { status: 500 }
        );
    }
}
