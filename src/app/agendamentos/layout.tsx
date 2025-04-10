import { Container } from "@mui/material";
import { ReactNode } from "react";

export default function AgendamentosLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
        </Container>
    );
}
