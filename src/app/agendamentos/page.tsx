import { SchedulingFilters } from "@/components/filters/scheduling-filters/index";
import SchedulingTable from "@/components/tables/scheduling-table";
import { Stack, Typography } from "@mui/material";

export default async function AgendamentosPage() {
    return (
        <>
            <Typography variant="h5" mb={2}>
                Agendamentos
            </Typography>

            <Stack spacing={2}>
                <SchedulingFilters />
                <SchedulingTable />
            </Stack>
        </>
    );
}
