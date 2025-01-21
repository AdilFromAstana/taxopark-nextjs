import { Park } from "@/app/interfaces/interfaces";
import React from "react";

interface CreateParkProps {
  newRecord: Omit<Park, "id" | "active" | "City">;
  setNewRecord: React.Dispatch<
    React.SetStateAction<Omit<Park, "id" | "active" | "City">>
  >;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddRecord: () => void;
}

const CreatePark: React.FC<CreateParkProps> = ({
  newRecord,
  setNewRecord,
  setIsCreateModalOpen,
  handleAddRecord,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[33vw] p-6">
        <h2 className="text-xl font-bold mb-4">Добавить таксопарк</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newRecord.title}
              onChange={(e) => {
                setNewRecord({ ...newRecord, title: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Город</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newRecord.cityId}
              onChange={(e) =>
                setNewRecord({ ...newRecord, cityId: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Комиссия</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newRecord.parkCommission ?? 0}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNewRecord({
                    ...newRecord,
                    parkCommission: value === "" ? null : Number(value), // Если пустая строка, устанавливаем null
                  });
                }
              }}
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">Бонусы</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newRecord.bonuses}
              onChange={(e) =>
                setNewRecord({ ...newRecord, bonuses: e.target.value })
              }
            />
          </div> */}
          <div className="flex justify-between space-x-2">
            <button
              className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
              onClick={handleAddRecord}
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
    </div>
  );
};

export default CreatePark;
