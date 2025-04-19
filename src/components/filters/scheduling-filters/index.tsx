import { Suspense } from "react";
import { ScheduleFilters } from "./filters";

export const SchedulingFilters = () => {
    return (
        <Suspense fallback={null}>
            <ScheduleFilters />
        </Suspense>
    );
};
