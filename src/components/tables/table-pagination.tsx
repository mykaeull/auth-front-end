"use client";

import { useURLParams } from "@/hooks/useURLParams";
import { TablePagination as MuiPagination } from "@mui/material";

interface TablePaginationProps {
    itemsTotal: number;
    page: number;
    pageSize: number;
}

export const TablePagination = ({
    itemsTotal,
    page,
    pageSize,
}: TablePaginationProps) => {
    const pageFilter = useURLParams("page");
    const pageSizeFilter = useURLParams("pageSize");

    return (
        <MuiPagination
            component="div"
            count={itemsTotal}
            page={page - 1} // Corrige para base 0
            rowsPerPage={pageSize}
            onPageChange={(_, newPage) => pageFilter(newPage + 1)} // Volta para base 1
            onRowsPerPageChange={(e) => {
                pageFilter(1);
                pageSizeFilter(+e.target.value);
            }}
            labelRowsPerPage="Itens por página"
        />
    );
};
