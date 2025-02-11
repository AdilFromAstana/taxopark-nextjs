import { memo, useState } from "react";
import {
  EntityWithStatus,
  Field,
} from "../interfaces/interfaces";

interface UpdateFormProps<T> {
  setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: T;
}

const entityFields: {
  [K in EntityWithStatus["entityType"]]: Field<
    Extract<EntityWithStatus, { entityType: K }>
  >[];
} = {
  Parks: [
    { key: "title", label: "Имя" },
    { key: "active", label: "Активный" },
    { key: "accountantSupport", label: "Поддержка бухгатерии" },
    { key: "averageCheck", label: "Средний чек" },
    { key: "commissionWithdraw", label: "Комиссия снятия" },
    { key: "entrepreneurSupport", label: "Поддержка ИП" },
    { key: "parkPromotions", label: "Акции" },
    { key: "yandexGasStation", label: "Яндекс.Заправки" },
  ],
  Forms: [
    { key: "name", label: "ФИО" },
    { key: "Park", label: "Парк" },
    { key: "phoneNumber", label: "Номер телефона" },
  ],
  Promotions: [
    { key: "park", label: "Таксопарк" },
    { key: "title", label: "Название" },
    { key: "expires", label: "Активно до" },
    { key: "createdAt", label: "Создано" },
  ],
};

const UpdateModal = memo(
  <T extends EntityWithStatus>({
    setIsViewEditModalOpen,
    selectedRecord,
  }: UpdateFormProps<T>) => {
    const fields = entityFields[selectedRecord.entityType] as Field<T>[];
    const [isEditMode, setIsEditMode] = useState(false);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[33vw] p-6">
          <h2 className="text-xl font-bold mb-4">Просмотр записи</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field) => {
                const keyAsString = field.key as keyof T;
                const value = selectedRecord[keyAsString];
                const displayValue =
                  field.format && value !== undefined
                    ? field.format(value)
                    : value !== undefined && value !== null
                      ? String(value) // Приведение к строке
                      : "Нет данных";

                return (
                  <div key={String(keyAsString)} className="w-full">
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 h-10"
                      value={displayValue}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between space-x-2">
              {isEditMode ? (
                <>
                  <button
                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                  // onClick={updatePark}
                  >
                    Сохранить
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                    onClick={() => {
                      setIsEditMode(false);
                      // const updatedPark = parks.find(
                      //   (item) => item.id === selectedRecord.id
                      // );
                      // if (updatedPark) {
                      //   setSelectedRecord(updatedPark);
                      // }
                    }}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                      onClick={() => setIsEditMode(true)}
                    >
                      Редактировать
                    </button>
                    {selectedRecord.entityType !== "Forms" && selectedRecord.active ? (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                      // onClick={changeStatus}
                      >
                        Архивировать
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-200"
                      // onClick={changeStatus}
                      >
                        Активировать
                      </button>
                    )}
                  </div>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsViewEditModalOpen(false)}
                  >
                    Закрыть
                  </button>
                </>
              )}
            </div>
            {/* <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                onClick={() => setIsViewEditModalOpen(false)}
              >
                Закрыть
              </button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
);

UpdateModal.displayName = "UpdateForm";
export default UpdateModal;
