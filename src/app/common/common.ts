export function formatPhoneNumber(phoneNumber: string) {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length !== 11 || cleaned[0] !== "7") {
        throw new Error("Некорректный номер телефона. Убедитесь, что номер начинается с +7 и состоит из 11 цифр.");
    }

    const formatted = `+7-(${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    return formatted;
}

export function formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}