"use client";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { TablePagination } from "./table-pagination";
import { Scheduling } from "@/types/schedule";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";

export default function SchedulingTable() {
    const searchParams = useSearchParams();

    const queryParams = {
        page: searchParams.get("page") || "1",
        pageSize: searchParams.get("pageSize") || "10",
        name: searchParams.get("name") || undefined,
        date: searchParams.get("date") || undefined,
        type: searchParams.get("type") || undefined,
        payment_method: searchParams.get("payment_method") || undefined,
        paid: searchParams.get("paid") || undefined,
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["scheduling", queryParams],
        queryFn: async () => {
            const res = await apiClient.get("/api/agendamentos", {
                params: {
                    ...queryParams,
                },
            });
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
            </Paper>
        );
    }

    if (isError || !data || data.items.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1">
                    Nenhum agendamento encontrado.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Contato</TableCell>
                            <TableCell>Serviço</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Horário</TableCell>
                            <TableCell>Pagamento</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.items.map((row: Scheduling) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.time}</TableCell>
                                <TableCell>{row.payment_method}</TableCell>
                                <TableCell>
                                    {row.paid ? "Pago" : "Não pago"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                itemsTotal={data.itemsTotal}
                page={+queryParams.page}
                pageSize={+queryParams.pageSize}
            />
        </Paper>
    );
}
