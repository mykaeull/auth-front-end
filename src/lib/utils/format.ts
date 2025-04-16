export function formatPhone(phone: string) {
    // Remove o "+55" e trim
    return phone.replace("+55", "").trim();
}

export function formatDate(isoDate: string) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}
