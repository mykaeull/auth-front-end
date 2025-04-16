"use client";

import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type ErrorResponse = { message: string };

const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const response = await apiClient.post("/api/login", data);
            return response.data;
        },
        onSuccess: () => {
            // toast.success(`Bem-vinda, ${data.name}!`);
            router.push("/agendamentos");
            router.refresh();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            const message =
                error.response?.data?.message || "Erro ao tentar fazer login.";
            toast.error(message);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    fullWidth
                    label="E-mail"
                    margin="normal"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Senha"
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loginMutation.isPending}
                    sx={{
                        mt: 2,
                        height: 42,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {loginMutation.isPending ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        "Entrar"
                    )}
                </Button>

                {/* <Typography align="center" sx={{ mt: 2 }}>
                    OU
                </Typography>

                <Typography
                    onClick={() => router.push("/register")}
                    sx={{
                        mt: 1,
                        width: "100%",
                        border: "none",
                        background: "none",
                        color: "secondary.main",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    Crie uma conta
                </Typography> */}
            </Box>
        </Container>
    );
}
