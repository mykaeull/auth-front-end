import SchedulingForm from "@/components/forms/scheduling-form";

interface AgendamentoPageProps {
    params: {
        userId: string;
    };
}

export default function AgendamentoPage({ params }: AgendamentoPageProps) {
    const { userId } = params;

    return <SchedulingForm userId={userId} />;
}
