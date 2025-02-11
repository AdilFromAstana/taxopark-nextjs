import { memo, useState } from "react";
import {
  EntityType,
  Field,
  Form,
  Park,
  Promotion,
} from "../interfaces/interfaces";

interface UpdateFormProps<T> {
  setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: T;
  entityType: EntityType;
  format: any;
}

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

const entityFields = {
  Park: [
    { key: "title", label: "Имя" },
    { key: "parkId", label: "Парк" },
    { key: "description", label: "Описание" },
  ],
  Form: [
    { key: "name", label: "Имя водителя" },
    { key: "licenseNumber", label: "Номер лицензии" },
    { key: "experience", label: "Стаж (лет)" },
  ],
  Promotion: [
    { key: "model", label: "Модель автомобиля" },
    { key: "licensePlate", label: "Госномер" },
    { key: "year", label: "Год выпуска" },
  ],
};

const UpdateModal = memo(
  <T extends Promotion | Form | Park>({
    setIsViewEditModalOpen,
    selectedRecord,
    entityType,
  }: UpdateFormProps<T>) => {
    console.log("selectedRecord: ", selectedRecord);
    const fields = entityFields[entityType] as Field<T>[];

    console.log("fields: ", fields);

    const [isEditMode, setIsEditMode] = useState(false);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[33vw] p-6">
          <h2 className="text-xl font-bold mb-4">Просмотр записи</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field) => {
                const value = getNestedValue(
                  selectedRecord as Record<string, any>,
                  field.key
                );
                const displayValue = field.format
                  ? field.format(value)
                  : value ?? "Нет данных";

                return (
                  <div key={String(field.key)} className="w-full">
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
                    {selectedRecord.active ? (
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
