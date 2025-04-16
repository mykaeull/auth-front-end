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
import { formatDate, formatPhone } from "@/lib/utils/format";
import ConfirmPayment from "../dialogs/confirm-payment";
import { Suspense } from "react";

export default function SchedulingTable() {
    function ScheduleTable() {
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

        const { data, isError, isLoading } = useQuery({
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

        return (
            <>
                {(isError || !data || data.items.length === 0) && (
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body1">
                            Nenhum agendamento encontrado.
                        </Typography>
                    </Paper>
                )}
                {data && data.items.length > 0 && (
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
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.items.map((row: Scheduling) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                {formatPhone(row.contact)}
                                            </TableCell>
                                            <TableCell>
                                                {row.type === "corte&barba"
                                                    ? "corte + barba"
                                                    : row.type}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(row.date)}
                                            </TableCell>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>
                                                {row.payment_method}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: row.paid
                                                        ? "success.main"
                                                        : "error.main",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {row.paid ? "Pago" : "Não pago"}
                                            </TableCell>
                                            <TableCell>
                                                {!row.paid && (
                                                    <ConfirmPayment
                                                        schedulingId={row.id}
                                                    />
                                                )}
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
                )}
            </>
        );
    }

    return (
        <Suspense>
            <ScheduleTable />
        </Suspense>
    );
}
