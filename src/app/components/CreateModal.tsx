import { memo, useState } from "react";
import { City, EntityWithStatus, Field, Park } from "../interfaces/interfaces";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext";
import MultiSelect from "./Parks/component/MultiSelect";
import Dropdown from "./Parks/component/Dropdown";

interface CreateFormProps<T> {
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    entityType: EntityWithStatus["entityType"];
    parks: Park[];
    cities: City[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const entityFields: Partial<{ [K in EntityWithStatus["entityType"]]: Field<Extract<EntityWithStatus, { entityType: K }>>[] }> = {
    Parks: [
        { key: "title", label: "Имя", dataType: "text" },
        { key: "cityId", label: "Город", dataType: "select", optionsType: "cities" },
        { key: "accountantSupport", label: "Поддержка бухгалтерии", dataType: "select", optionsType: "booleans" },
        { key: "averageCheck", label: "Средний чек", dataType: "text" },
        { key: "commissionWithdraw", label: "Комиссия снятия", dataType: "text" },
        { key: "entrepreneurSupport", label: "Поддержка ИП", dataType: "select", optionsType: "booleans" },
        { key: "parkPromotions", label: "Акции", dataType: "multiSelect" },
        { key: "yandexGasStation", label: "Яндекс.Заправки", dataType: "select", optionsType: "booleans" },
    ],
    Promotions: [
        { key: "park.id", label: "Таксопарк", dataType: "select", optionsType: "parks" },
        { key: "title", label: "Название", dataType: "text" },
        { key: "expires", label: "Активно до", dataType: "dateRange" },
    ],
};
const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let temp = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]] = temp[keys[i]] || {};
    }
    temp[keys[keys.length - 1]] = value;
};
const getNestedValue = (
    obj: Record<string, any>,
    path: string | string[]
): any => {
    if (typeof path === "string") return obj[path];
    return path.reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
        obj
    );
};

const CreateModal = memo(<T extends EntityWithStatus>({
    setIsCreateModalOpen,
    setData,
    entityType,
    cities,
    parks
}: CreateFormProps<T>) => {
    const fields = entityFields[entityType] as Field<T>[];
    const [newRecord, setNewRecord] = useState<T>(
        Object.fromEntries(fields.map((field) => [field.key, field.dataType === "multiSelect" ? [] : ""])) as unknown as T
    );

    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotifications();

    const createItem = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/${entityType}`, newRecord);
            const createdItem = response.data;
            if (!createdItem) {
                throw new Error("Некорректный ответ сервера");
            }
            setData((prevData) => [...prevData, createdItem]);
            addNotification({
                type: "success",
                message: "Таксопарк успешно добавлен!",
            });
            setIsCreateModalOpen(false);
        } catch (error: any) {
            addNotification({
                type: "error",
                message:
                    error.message || "Произошла ошибка при добавлении таксопарка",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (key: keyof T | string, value: any) => {
        setNewRecord((prev) => {
            const updatedRecord = { ...prev };
            if (typeof key === "string" && key.includes(".")) {
                setNestedValue(updatedRecord, key, value);
            } else {
                updatedRecord[key as keyof T] = value;
            }
            return updatedRecord;
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[75vw] p-6">
                <h2 className="text-xl font-bold mb-4">Создание записи</h2>
                <div className="space-y-4">
                    {fields.map((field) => {
                        return <div key={String(field.key)} className="w-full">
                            <label className="block text-sm font-medium mb-1">{field.label}</label>
                            {field.dataType === "text" && (
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 h-10"
                                    value={
                                        typeof newRecord[field.key as keyof T] === "object"
                                            ? ""
                                            : String(newRecord[field.key as keyof T] || "")
                                    }
                                    onChange={(value) => handleChange(field.key as string, value.target.value)}
                                />
                            )}
                            {field.dataType === "select" && field.optionsType === "booleans" && (
                                <Dropdown
                                    value={newRecord[field.key as keyof T]}
                                    options={[{ label: "Да", value: true }, { label: "Нет", value: false }]}
                                    onChange={(value) => handleChange(field.key, value)}
                                />
                            )}
                            {field.dataType === "select" && field.optionsType === "cities" && (
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 h-10"
                                    value={getNestedValue(newRecord, field.key as string)}
                                    onChange={(value) => handleChange(field.key, value.target.value)}
                                >
                                    <option value="">Выберите...</option>
                                    {cities.map(city =>
                                        <option key={city.id} value={city.id}>
                                            {city.title}
                                        </option>)}
                                </select>
                            )}
                            {field.dataType === "select" && field.optionsType === "parks" && (
                                <Dropdown
                                    value={newRecord[field.key as keyof T]}
                                    options={parks.map(p => ({ label: p.title, value: p.id }))}
                                    onChange={(value) => handleChange(field.key, value)}
                                />
                            )}
                            {field.dataType === "multiSelect" && (
                                <MultiSelect
                                    values={newRecord[field.key as keyof T] as number[]}
                                    options={[
                                        { label: "Гарантированные бонусы", value: 1 },
                                        { label: "Приветственные бонусы", value: 2 },
                                        { label: "Розыгрыш", value: 3 },
                                        { label: "Бонус за активность", value: 4 },
                                        { label: "Приведи друга", value: 5 },
                                    ]}
                                    onChange={(values) => handleChange(field.key, values)}
                                />
                            )}
                            {/* {field.dataType === "dateRange" && (
                                <DatePicker
                                    selected={newRecord[field.key as keyof T] as Date}
                                    onChange={(date) => handleChange(field.key, date)}
                                    className="w-full border border-gray-300 rounded-lg p-2 h-10"
                                    dateFormat="yyyy-MM-dd"
                                />
                            )} */}
                        </div>
                    })}
                </div>
                <div className="flex justify-between space-x-2">
                    <button
                        className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                        onClick={createItem}
                        disabled={isLoading}
                    >
                        {isLoading ? "Создание..." : "Создать"}
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
});

CreateModal.displayName = "CreateModal";
export default CreateModal;
