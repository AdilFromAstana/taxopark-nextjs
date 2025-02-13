import { useNotifications } from "@/app/context/NotificationContext";
import { useNotification } from "@/app/hooks/useNotification";
import React, { useEffect, useState } from "react";

interface Notification {
    id: string;
    type: "success" | "error"; // Тип уведомления
    message: string; // Текст сообщения
}

const NotificationBar: React.FC = () => {

    const { notifications } = useNotifications()

    return (
        <div className="fixed top-4 right-4 space-y-4 z-50">
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} />
            ))}
        </div>
    );
};

const NotificationItem: React.FC<Notification> = ({ type, message }) => {
    const [progress, setProgress] = useState(100);
    const DEFAULT_DURATION = 5000;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - 100 / (DEFAULT_DURATION / 100)));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`p-4 rounded shadow-lg text-white ${type === "success"
                ? "bg-green-400 border border-green-500"
                : "bg-red-400 border border-red-500"
                }`}
        >
            <div className="flex justify-between items-center">
                <span className="font-medium">{message}</span>
            </div>
            <div className="h-1 mt-2 rounded overflow-hidden bg-gray-200">
                <div
                    className={`h-full ${type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
                ></div>
            </div>
        </div>
    );
};

export default NotificationBar;
