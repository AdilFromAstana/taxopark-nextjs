import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Notification } from "@/app/interfaces/interfaces";

interface NotificationContextProps {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);

        setNotifications((prev) => [...prev, { ...notification, id }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
