import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/services/api/api-server";
import { AxiosError } from "axios";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const response = await apiServer.post(`/scheduling/${id}/pay`);

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message =
                error.response?.data?.message || "Erro ao processar pagamento";

            return NextResponse.json({ message }, { status });
        }

        console.error("[PAGAMENTO_ERROR]", error);
        return NextResponse.json(
            { message: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}
