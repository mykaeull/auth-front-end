import { Suspense } from "react";
import { ScheduleTable } from "./table";

export const SchedulingFilters = () => {
    return (
        <Suspense fallback={null}>
            <ScheduleTable />
        </Suspense>
    );
};
