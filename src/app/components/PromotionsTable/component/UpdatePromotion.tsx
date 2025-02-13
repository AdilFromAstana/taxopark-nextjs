import { Promotion } from "@/app/interfaces/interfaces";
import { memo, useState } from "react";
import axios from "axios";
import { useNotifications } from "@/app/context/NotificationContext";
import TextInput from "../../Parks/component/TextInput";
import Dropdown from "../../Parks/component/Dropdown";
import SearchableDropdown from "../../SearchableDropdown";

interface UpdatePromotionProps {
    setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRecord: Promotion;
    setSelectedRecord: React.Dispatch<React.SetStateAction<Promotion | null>>;
    promotions: Promotion[];
    parks: any[];
    setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpdatePromotion: React.FC<UpdatePromotionProps> = memo(
    ({ setIsViewEditModalOpen, isEditMode, setIsEditMode, selectedRecord, setSelectedRecord, promotions, parks, setPromotions }) => {
        const { addNotification } = useNotifications();
        const [isLoading, setIsLoading] = useState(false);

        const updatePromotion = async () => {
            if (selectedRecord) {
                try {
                    setIsLoading(true);
                    const response = await axios.put(`${API_URL}/promotions/${selectedRecord.id}`, selectedRecord);
                    const updatedPromotion = response.data;
                    setPromotions((prevPromotions) =>
                        prevPromotions.map((promo) => (promo.id === selectedRecord.id ? { ...promo, ...updatedPromotion } : promo))
                    );
                    addNotification({
                        type: "success",
                        message: "Промоакция успешно обновлена!",
                    });
                    setIsViewEditModalOpen(false);
                    setSelectedRecord(null);
                } catch (error: any) {
                    addNotification({
                        type: "error",
                        message: error.message || "Произошла ошибка при обновлении промоакции",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg w-[50vw] p-6">
                    <h2 className="text-xl font-bold mb-4">{isEditMode ? "Редактировать промоакцию" : "Просмотр промоакции"}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            value={selectedRecord.title}
                            label="Название"
                            onChange={(value) => setSelectedRecord({ ...selectedRecord, title: value })}
                            disabled={!isEditMode}
                        />
                        <div>
                            <label className="block text-sm font-medium mb-1">Таксопарк</label>
                            <SearchableDropdown
                                value={selectedRecord.parkId}
                                onChange={(value) => setSelectedRecord({ ...selectedRecord, parkId: value })}
                                apiUrl={`${API_URL}/parks/getByName`}
                            />
                        </div>
                        <TextInput
                            value={selectedRecord.description}
                            label="Описание"
                            onChange={(value) => setSelectedRecord({ ...selectedRecord, description: value })}
                            disabled={!isEditMode}
                        />
                        <TextInput
                            value={selectedRecord.startDate}
                            label="Дата начала"
                            onChange={(value) => setSelectedRecord({ ...selectedRecord, startDate: value })}
                            disabled={!isEditMode}
                        />
                        <TextInput
                            value={selectedRecord.expires || ""}
                            label="Дата окончания"
                            onChange={(value) => setSelectedRecord({ ...selectedRecord, expires: value || null })}
                            disabled={!isEditMode}
                        />
                        <Dropdown
                            label="Активность"
                            value={selectedRecord.active}
                            onChange={(value) => {
                                if (value !== undefined && value !== null) {
                                    setSelectedRecord({ ...selectedRecord, active: value })
                                }
                            }
                            }
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        {isEditMode ? (
                            <>
                                <button className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200" onClick={updatePromotion}>Сохранить</button>
                                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200" onClick={() => setIsEditMode(false)}>Отмена</button>
                            </>
                        ) : (
                            <>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200" onClick={() => setIsEditMode(true)}>Редактировать</button>
                                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200" onClick={() => setIsViewEditModalOpen(false)}>Закрыть</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

UpdatePromotion.displayName = "UpdatePromotion";

export default UpdatePromotion;
