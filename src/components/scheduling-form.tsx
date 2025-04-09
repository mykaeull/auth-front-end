"use client";

import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { MuiTelInput } from "mui-tel-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { apiClient } from "@/services/api/api-client";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import { useMutation, useQuery } from "@tanstack/react-query";

const schedulingSchema = z.object({
    name: z.string().min(2, "Informe seu nome"),
    contact: z
        .string()
        .min(15, "Número inválido")
        .regex(
            /^\+55 \d{2} \d{4,5} \d{4}$/,
            "Formato inválido. Ex: +55 85 98828 9320"
        ),
    type: z
        .string()
        .refine((val) => ["corte", "barba", "corte&barba"].includes(val), {
            message: "Selecione um serviço válido",
        }),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
        .refine(
            (val) => {
                const today = new Date();
                const selected = new Date(val + "T00:00:00");

                today.setHours(0, 0, 0, 0); // zera a hora de hoje
                return selected >= today;
            },
            {
                message: "A data deve ser hoje ou uma data futura",
            }
        ),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
    payment_method: z
        .string()
        .refine((val) => ["pix", "espécie"].includes(val), {
            message: "Selecione uma forma de pagamento",
        }),
});

type SchedulingFormData = z.infer<typeof schedulingSchema>;

export default function SchedulingForm() {
    const [showQRModal, setShowQRModal] = useState(false);
    const [schedulingDate, setSchedulingDate] = useState("");
    const dataToSubmit = useRef<SchedulingFormData | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        control,
    } = useForm<SchedulingFormData>({
        resolver: zodResolver(schedulingSchema),
        defaultValues: {
            name: "",
            contact: "",
            type: "",
            date: "",
            time: "",
            payment_method: "",
        },
    });

    const paymentMethod = watch("payment_method");
    const type = watch("type");

    const { data: availableTimes = [], isLoading: loadingTimes } = useQuery({
        queryKey: ["available-times", schedulingDate],
        queryFn: async () => {
            if (!schedulingDate) return [];
            const res = await apiClient.get("/api/agendamento", {
                params: {
                    date: schedulingDate,
                },
            });
            return res.data as string[];
        },
        enabled: schedulingDate.length === 10, // só busca quando a data for válida
    });

    const mutation = useMutation({
        mutationFn: async (data: SchedulingFormData) => {
            const payload = {
                name: data.name,
                contact: data.contact,
                type: data.type,
                date: data.date,
                time: data.time,
                payment_method: data.payment_method,
            };

            const res = await apiClient.post("/api/agendamento", payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Agendamento realizado com sucesso!");
            reset();
            setValue("type", "");
            setValue("payment_method", "");
            setSchedulingDate("");
        },
        onError: () => {
            toast.error("Erro ao agendar.");
        },
    });

    const onSubmit = (data: SchedulingFormData) => {
        if (paymentMethod === "pix") {
            dataToSubmit.current = data;
            setShowQRModal(true);
        } else {
            mutation.mutate(data);
        }
    };

    const confirmarPagamento = () => {
        if (dataToSubmit.current) {
            mutation.mutate(dataToSubmit.current);
            dataToSubmit.current = null;
            setShowQRModal(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Agendar Horário
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

                <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => (
                        <MuiTelInput
                            {...field}
                            defaultCountry="BR"
                            onlyCountries={["BR"]}
                            forceCallingCode
                            label="Contato"
                            fullWidth
                            margin="normal"
                            error={!!errors.contact}
                            helperText={errors.contact?.message}
                        />
                    )}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Serviço</InputLabel>
                    <Select
                        labelId="type-label"
                        label="Serviço"
                        {...register("type")}
                        error={!!errors.type}
                        value={type}
                    >
                        <MenuItem value="corte">Corte de cabelo</MenuItem>
                        <MenuItem value="barba">Barba</MenuItem>
                        <MenuItem value="corte&barba">Corte + Barba</MenuItem>
                    </Select>
                    {errors.type && (
                        <Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1.5, mt: 0.5 }}
                        >
                            {errors.type.message}
                        </Typography>
                    )}
                </FormControl>

                <TextField
                    fullWidth
                    label="Data"
                    type="date"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    {...register("date")}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    sx={{
                        input: {
                            colorScheme: "dark",
                        },
                    }}
                    value={schedulingDate}
                    onChange={(e) => {
                        const val = e.target.value;
                        // Aceita apenas datas válidas no formato yyyy-mm-dd (10 caracteres)
                        if (
                            val.length === 10 &&
                            /^\d{4}-\d{2}-\d{2}$/.test(val)
                        ) {
                            setSchedulingDate(val);
                        } else if (val === "") {
                            setSchedulingDate("");
                        }
                    }}
                    inputProps={{
                        maxLength: 10,
                        pattern: "\\d{4}-\\d{2}-\\d{2}",
                    }}
                />

                <FormControl
                    fullWidth
                    margin="normal"
                    disabled={!schedulingDate || loadingTimes}
                >
                    <InputLabel id="time-label">Horário</InputLabel>
                    <Select
                        labelId="time-label"
                        label="Horário"
                        {...register("time")}
                        error={!!errors.time}
                        value={watch("time")}
                    >
                        {availableTimes.map((hour) => (
                            <MenuItem key={hour} value={hour}>
                                {hour}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.time && (
                        <Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1.5, mt: 0.5 }}
                        >
                            {errors.time.message}
                        </Typography>
                    )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="payment-label">
                        Forma de pagamento
                    </InputLabel>
                    <Select
                        labelId="payment-label"
                        label="Forma de pagamento"
                        {...register("payment_method")}
                        error={!!errors.payment_method}
                        value={paymentMethod}
                    >
                        <MenuItem value="espécie">
                            Presencial (espécie)
                        </MenuItem>
                        <MenuItem value="pix">PIX</MenuItem>
                    </Select>
                    {errors.payment_method && (
                        <Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1.5, mt: 0.5 }}
                        >
                            {errors.payment_method.message}
                        </Typography>
                    )}
                </FormControl>

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={mutation.isPending}
                    sx={{ mt: 2 }}
                >
                    {mutation.isPending ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        "Agendar"
                    )}
                </Button>
            </Box>

            {/* Modal de QR Code */}
            <Dialog open={showQRModal} onClose={() => setShowQRModal(false)}>
                <DialogTitle>Pagamento via PIX</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", justifyContent: "center" }}
                >
                    <QRCodeSVG
                        value="https://pagamento-pix-exemplo.com"
                        size={200}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowQRModal(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmarPagamento} variant="contained">
                        Confirmar pagamento
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
