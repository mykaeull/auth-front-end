"use client";

import {
    Stack,
    TextField,
    Autocomplete,
    Checkbox,
    FormControl,
    Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useCallback } from "react";
import { useURLParams } from "@/hooks/useURLParams";
import debounce from "lodash.debounce";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const payment_methods = [
    { id: "pix", name: "PIX" },
    { id: "espécie", name: "Espécie" },
];

const types = [
    { id: "corte", name: "Corte" },
    { id: "barba", name: "Barba" },
    { id: "corteEbarba", name: "Corte + Barba" },
];

const status = [
    { id: "pago", name: "Pago" },
    { id: "nao_pago", name: "Não Pago" },
];

export const ScheduleFilters = () => {
    const searchParams = useSearchParams();

    const nameFilter = useURLParams("name");
    const dateFilter = useURLParams("date");
    const paymentFilter = useURLParams("payment_method");
    const typeFilter = useURLParams("type");
    const paidFilter = useURLParams("paid");
    const pageFilter = useURLParams("page");
    const pageSizeFilter = useURLParams("pageSize");

    useEffect(() => {
        if (!searchParams.get("page")) pageFilter(1);
        if (!searchParams.get("pageSize")) pageSizeFilter(10);
    }, [searchParams]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderCustomTags = (value: { [k: string]: any }[]) => {
        const numTags = value.length;
        const limitTags = 1;

        return (
            <>
                {value.slice(0, limitTags).map((option, index) => (
                    <Fragment key={option.id ?? index}>
                        <Typography maxWidth="110px" noWrap>
                            {option.name}
                        </Typography>
                        <Typography mr={index + 1 === numTags ? 0 : 1}>
                            {index + 1 === numTags ? "" : ","}
                        </Typography>
                    </Fragment>
                ))}
                {numTags > limitTags && ` +${numTags - limitTags}`}
            </>
        );
    };

    const paymentOptions = useMemo(() => payment_methods, []);
    const typeOptions = useMemo(() => types, []);
    const statusOptions = useMemo(() => status, []);

    const debouncedNameFilter = useCallback(
        debounce((value: string) => {
            pageFilter(1);
            nameFilter(value);
        }, 400),
        []
    );

    return (
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
            <TextField
                label="Nome"
                variant="outlined"
                defaultValue={searchParams.get("name") || ""}
                onChange={(e) => debouncedNameFilter(e.target.value)}
            />

            <TextField
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue={searchParams.get("date") || ""}
                sx={{
                    input: {
                        colorScheme: "dark",
                    },
                }}
                onChange={(e) => {
                    pageFilter(1);
                    dateFilter(e.target.value);
                }}
            />

            <FormControl sx={{ minWidth: 200 }}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={paymentOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => {
                        pageFilter(1);
                        paymentFilter(value);
                    }}
                    renderTags={renderCustomTags}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                key={option.id}
                            />
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Forma de pagamento"
                            variant="outlined"
                        />
                    )}
                />
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={typeOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => {
                        pageFilter(1);
                        typeFilter(value);
                    }}
                    renderTags={renderCustomTags}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                key={option.id}
                            />
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Serviço"
                            variant="outlined"
                        />
                    )}
                />
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={statusOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => {
                        pageFilter(1);
                        paidFilter(value);
                    }}
                    renderTags={renderCustomTags}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                key={option.id}
                            />
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Status"
                            variant="outlined"
                        />
                    )}
                />
            </FormControl>
        </Stack>
    );
};
