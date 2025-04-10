import SchedulingTable from "@/components/tables/scheduling-table";
import { SchedulingFilters } from "@/components/filters/scheduling-filters";
import { Stack, Typography } from "@mui/material";

export default async function AgendamentosPage({
    searchParams,
}: {
    searchParams: {
        page?: string;
        pageSize?: string;
        name?: string;
        date?: string;
        type?: string;
        payment_method?: string;
        paid?: string;
    };
}) {
    return (
        <>
            <Typography variant="h5" mb={2}>
                Agendamentos
            </Typography>

            <Stack spacing={2}>
                <SchedulingFilters />
                <SchedulingTable searchParams={searchParams} />
            </Stack>
        </>
    );
}
