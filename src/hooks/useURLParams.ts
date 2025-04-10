import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useURLParams = (fieldName: string) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (value: any) => {
        const params = new URLSearchParams(searchParams);

        if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object"
        ) {
            const valueArray = value as Array<{ id: string }>;
            params.set(fieldName, valueArray.map((item) => item.id).toString());
        } else if (!!value || Number(value) >= 0) {
            params.set(fieldName, String(value));
        } else {
            params.delete(fieldName);
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
};
