"use client";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/api-client";
import { toast } from "react-toastify";

interface ConfirmPaymentProps {
    schedulingId: number;
}

export default function ConfirmPayment({ schedulingId }: ConfirmPaymentProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await apiClient.post(
                `/api/agendamentos/${schedulingId}/pay`
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Status de pagamento atualizado com sucesso.");
            queryClient.invalidateQueries({ queryKey: ["scheduling"] });
            setOpen(false);
        },
        onError: () => {
            toast.error("Erro ao confirmar pagamento.");
        },
    });

    return (
        <>
            <Button
                size="small"
                variant="text"
                color="success"
                onClick={() => setOpen(true)}
            >
                Confirmar
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirmar pagamento</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja marcar este agendamento como
                        pago?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
