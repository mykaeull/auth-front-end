"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    const handleLogout = () => {
        router.push("/logout");
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Bem-vindo
            </Typography>

            <Box mt={4} display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                >
                    Sair
                </Button>
            </Box>
        </Container>
    );
}
