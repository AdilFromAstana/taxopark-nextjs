import { useState } from "react";

interface Notification {
    id: string;
    type: "success" | "error";
    message: string;
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const DEFAULT_DURATION = 5000; // Жестко зашитая продолжительность

    const addNotification = (notification: Omit<Notification, "id">) => {
        console.log("notification: ", notification)
        const id = Math.random().toString(36).substr(2, 9); // Генерация уникального ID
        setNotifications((prev) => [...prev, { ...notification, id }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, DEFAULT_DURATION);
    };

    return {
        notifications,
        addNotification,
    };
};
