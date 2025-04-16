import SchedulingForm from "@/components/forms/scheduling-form";

interface AgendamentoPageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default async function AgendamentoPage({
    params,
}: AgendamentoPageProps) {
    const { userId } = await params;

    return <SchedulingForm userId={userId} />;
}
