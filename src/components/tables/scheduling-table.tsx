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
import { Suspense } from "react";
import { TablePagination } from "./table-pagination";
import { getAllSchedule } from "@/services/server/schedule";
import { Scheduling } from "@/types/schedule";

interface SchedulingTableProps {
    searchParams: {
        page?: string;
        pageSize?: string;
        name?: string;
        date?: string;
        type?: string;
        payment_method?: string;
        paid?: string;
    };
}

export default async function SchedulingTable({
    searchParams,
}: SchedulingTableProps) {
    // if (loading) {
    //     return (
    //         <Paper sx={{ p: 4, textAlign: "center" }}>
    //             <CircularProgress />
    //         </Paper>
    //     );
    // }

    // if (!data || data.items.length === 0) {
    //     return (
    //         <Paper sx={{ p: 4, textAlign: "center" }}>
    //             <Typography variant="body1">
    //                 Nenhum agendamento encontrado.
    //             </Typography>
    //         </Paper>
    //     );
    // }

    const ScheduleTable = async () => {
        const scheduleData = await getAllSchedule({
            ...searchParams,
        });

        return (
            <Paper>
                {(!scheduleData || scheduleData.items?.length === 0) && (
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body1">
                            Nenhum agendamento encontrado.
                        </Typography>
                    </Paper>
                )}
                {scheduleData && scheduleData.items?.length > 0 && (
                    <>
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
                                    {scheduleData.items.map(
                                        (row: Scheduling) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.contact}
                                                </TableCell>
                                                <TableCell>
                                                    {row.type}
                                                </TableCell>
                                                <TableCell>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell>
                                                    {row.time}
                                                </TableCell>
                                                <TableCell>
                                                    {row.payment_method}
                                                </TableCell>
                                                <TableCell>
                                                    {row.paid
                                                        ? "Pago"
                                                        : "Não pago"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            itemsTotal={scheduleData.itemsTotal}
                            page={scheduleData.page}
                            pageSize={scheduleData.pageSize}
                        />
                    </>
                )}
            </Paper>
        );
    };

    return (
        <Suspense
            fallback={
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <CircularProgress />
                </Paper>
            }
        >
            <ScheduleTable />
        </Suspense>
    );
}
