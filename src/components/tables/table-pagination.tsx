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
            page={page}
            rowsPerPage={pageSize}
            onPageChange={(_, newPage) => pageFilter(newPage + 1)}
            onRowsPerPageChange={(e) => {
                pageFilter(1); // sempre volta pra primeira página ao mudar o tamanho
                pageSizeFilter(+e.target.value);
            }}
            labelRowsPerPage="Itens por página"
        />
    );
};
