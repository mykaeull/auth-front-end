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

const registerSchema = z
    .object({
        name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string().min(6, "Confirme sua senha"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterFormData) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...safeData } = data;
            const response = await apiClient.post("/api/register", safeData);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(`Conta criada com sucesso! Bem-vinda, ${data.name}!`);
            router.push("/welcome");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            const message =
                error.response?.data?.message || "Erro ao tentar registrar.";
            toast.error(message);
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Criar conta
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    fullWidth
                    label="Nome"
                    margin="normal"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

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

                <TextField
                    fullWidth
                    type="password"
                    label="Confirmar senha"
                    margin="normal"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={registerMutation.isPending}
                    sx={{
                        mt: 2,
                        height: 42,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {registerMutation.isPending ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        "Cadastrar"
                    )}
                </Button>
            </Box>
        </Container>
    );
}
