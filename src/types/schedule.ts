export type Scheduling = {
    id: number;
    name: string;
    contact: string;
    type: "corte" | "barba" | "corteEbarba" | string;
    date: string; // formato ISO ou 'yyyy-mm-dd'
    time: string; // ex: '11:00'
    payment_method: "pix" | "espécie";
    paid: boolean;
};
