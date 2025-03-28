"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark", // 👈 tema escuro ativado!
        background: {
            default: "#121212", // cor do body
            paper: "#1e1e1e", // cor de elementos tipo Card, AppBar etc
        },
        primary: {
            main: "#90caf9", // azul claro bonito para botões, links etc
        },
        secondary: {
            main: "#f48fb1", // rosa para destaque
        },
        text: {
            primary: "#ffffff", // texto principal
            secondary: "#cccccc", // texto menos importante
        },
    },
    typography: {
        fontFamily: "var(--font-roboto)",
    },
});

export default theme;
