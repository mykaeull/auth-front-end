import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";
import { AxiosError } from "axios";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await apiServer.post("/scheduling", body);

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message =
                error.response?.data?.message ||
                "Erro ao processar agendamento";

            return NextResponse.json({ message }, { status });
        }

        console.error("[AGENDAMENTO_ERROR]", error);
        return NextResponse.json(
            { message: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const date = req.nextUrl.searchParams.get("date");

        if (!date) {
            return NextResponse.json(
                { message: "Parâmetro 'date' é obrigatório" },
                { status: 400 }
            );
        }

        const response = await apiServer.get(`/scheduling/available-times`, {
            params: { date },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message =
                error.response?.data?.message ||
                "Erro ao buscar horários disponíveis";

            return NextResponse.json({ message }, { status });
        }

        console.error("[HORARIOS_DISPONIVEIS_ERROR]", error);
        return NextResponse.json(
            { message: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}
