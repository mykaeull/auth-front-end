import { NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";
import { AxiosError } from "axios";

export async function POST(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const body = await req.json();

        const userId = params.userId;

        const response = await apiServer.post(`/scheduling/${userId}`, body);

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
