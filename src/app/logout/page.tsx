"use client";

import { Stack, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    const logout = async () => {
        await fetch("/api/logout", { method: "post" }).then(() => {
            router.replace("/");
            router.refresh();
        });
    };

    useEffect(() => {
        logout();
    }, []);

    return (
        <Stack
            width="100vw"
            height="25vh"
            justifyContent="center"
            alignItems="center"
        >
            <CircularProgress style={{ width: "48px", height: "48px" }} />
        </Stack>
    );
}
