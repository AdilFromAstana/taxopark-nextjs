import React, { memo, useState } from "react";
import axios from "axios";
import TextInput from "../../Parks/component/TextInput";

interface CreatePromotionProps {
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    parks: any[];
    setPromotions: React.Dispatch<React.SetStateAction<any[]>>;
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const CreatePromotion: React.FC<CreatePromotionProps> = memo(
    ({ setIsCreateModalOpen, parks, setPromotions, setNotifications }) => {
        const [newPromotion, setNewPromotion] = useState({
            title: "",
            description: "",
            startDate: "",
            expires: "",
            active: true,
            parkId: "",
        });

        const [isLoading, setIsLoading] = useState(false);

        const addNotification = (notification: { type: string; message: string }) => {
            const id = Math.random().toString(36).substr(2, 9);
            setNotifications((prev) => [...prev, { ...notification, id }]);

            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 5000);
        };

        const createPromotion = async () => {
            try {
                setIsLoading(true);
                const response = await axios.post(
                    "http://188.94.156.86/api/promotions",
                    newPromotion
                );
                const createdPromotion = response.data;

                if (!createdPromotion) {
                    throw new Error("Некорректный ответ сервера");
                }

                setPromotions((prevPromotions) => [...prevPromotions, createdPromotion]);

                addNotification({
                    type: "success",
                    message: "Акция успешно добавлена!",
                });

                setIsCreateModalOpen(false);
            } catch (error: any) {
                addNotification({
                    type: "error",
                    message: error.message || "Произошла ошибка при добавлении акции",
                });
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg w-[35vw] p-6 space-y-4">
                    <h2 className="text-xl font-bold mb-4">Добавить акцию</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <TextInput
                            value={newPromotion.title}
                            label="Название акции"
                            onChange={(value) => setNewPromotion({ ...newPromotion, title: value })}
                        />
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Таксопарк</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={newPromotion.parkId}
                                onChange={(e) =>
                                    setNewPromotion({
                                        ...newPromotion,
                                        parkId: e.target.value,
                                    })
                                }
                            >
                                <option value="" disabled>
                                    Выберите таксопарк
                                </option>
                                {parks.map((park) => (
                                    <option key={park.id} value={park.id}>
                                        {park.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <TextInput
                            value={newPromotion.description}
                            label="Описание"
                            onChange={(value) => setNewPromotion({ ...newPromotion, description: value })}
                        />
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">Активен до:</label>
                            <input
                                value={newPromotion.expires}
                                type="date"
                                className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full h-10"
                                onChange={(e) => setNewPromotion({ ...newPromotion, expires: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                            onClick={createPromotion}
                        >
                            Сохранить
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

CreatePromotion.displayName = "CreatePromotion";

export default CreatePromotion;
