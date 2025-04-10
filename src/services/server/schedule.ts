import { Scheduling } from "@/types/schedule";
import { apiServer } from "../api/api-server";
import { PaginatedResponseType } from "@/types/response";
import { AxiosError } from "axios";

export async function getAllSchedule(props: {
    page?: string;
    pageSize?: string;
    name?: string;
    date?: string;
    type?: string;
    payment_method?: string;
    paid?: string;
}) {
    try {
        const response = await apiServer.get("/scheduling/all", {
            params: {
                page: props.page,
                pageSize: props.pageSize,
                name: props.name,
                date: props.date,
                type: props.type,
                payment_method: props.payment_method,
                paid: props.paid,
            },
            headers: {
                "Cache-Control": "no-cache",
            },
        });

        const schedulingData: PaginatedResponseType<Scheduling> | undefined =
            response.data;

        return schedulingData;
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message =
                error.response?.data?.message || "Erro ao buscar agendamentos";

            console.log(message, status);
            // return [];
        }

        console.error("[AGENDAMENTOS_ERROR]", error);
        // return [];
    }
}
