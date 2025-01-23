import { Park } from "@/app/interfaces/interfaces";
import { memo, useState } from "react";
import ModalDropdown from "./ModalDropdown";
import MultiSelect from "./MultiSelect";
import TextInput from "./TextInput";

interface UpdateParkProps {
  setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: Park;
  setSelectedRecord: React.Dispatch<React.SetStateAction<Park | null>>;
  parks: Park[];
  updatePark: () => void;
  cities: any[];
}

const UpdatePark: React.FC<UpdateParkProps> = memo(
  ({
    setIsViewEditModalOpen,
    isEditMode,
    setIsEditMode,
    selectedRecord,
    setSelectedRecord,
    parks,
    updatePark,
    cities = [],
  }) => {

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      value = value.replace(/[^0-9]/g, "");

      if (value.length > 2) {
        value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
      }

      if (value.length > 5) {
        value = value.slice(0, 5);
      }

      const [hours, minutes] = value.split(":").map(Number);
      if (hours > 23 || (minutes && minutes > 59)) {
        return;
      }

      setStartTime(value);
    };

    const handleEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      value = value.replace(/[^0-9]/g, "");

      if (value.length > 2) {
        value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
      }

      if (value.length > 5) {
        value = value.slice(0, 5);
      }

      const [hours, minutes] = value.split(":").map(Number);
      if (hours > 23 || (minutes && minutes > 59)) {
        return;
      }

      setEndTime(value);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[75vw] p-6">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Редактировать таксопарк" : "Просмотр таксопарка"}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                value={selectedRecord.title}
                label="Название"
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, title: value })
                }
              />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Город</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={selectedRecord.cityId}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      cityId: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Выберите город
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.title}
                    </option>
                  ))}
                </select>
              </div>
              <ModalDropdown
                label="Поддержка ИП водителей"
                value={selectedRecord.entrepreneurSupport}
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, entrepreneurSupport: value })
                }
              />
              <ModalDropdown
                label="Поддержка паркового ИП"
                value={selectedRecord.parkEntrepreneurSupport}
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, parkEntrepreneurSupport: value })
                }
              />
              <TextInput
                value={selectedRecord.commissionWithdraw ?? 0}
                label="Моментальные выплаты"
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setSelectedRecord({
                      ...selectedRecord,
                      commissionWithdraw: value === "" ? null : Number(value),
                    });
                  }
                }}
              />
              <TextInput
                value={selectedRecord.transferPaymentCommission ?? 0}
                label="Выплаты переводом"
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setSelectedRecord({
                      ...selectedRecord,
                      transferPaymentCommission: value === "" ? null : Number(value),
                    });
                  }
                }}
              />
              <TextInput
                value={selectedRecord.parkCommission ?? 0}
                label="Комиссия парка, %"
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setSelectedRecord({
                      ...selectedRecord,
                      parkCommission: value === "" ? null : Number(value),
                    });
                  }
                }}
              />
              <ModalDropdown
                label="Яндекс заправки"
                value={selectedRecord.yandexGasStation}
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, yandexGasStation: value })
                }
              />
              <ModalDropdown
                label="Поддержка бухгалтерии"
                value={selectedRecord.accountantSupport}
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, accountantSupport: value })
                }
              />
              <MultiSelect
                label="Бонусы"
                options={[
                  { label: "Скидка 10%", value: 1 },
                  { label: "Бесплатный вход", value: 2 },
                  { label: "Семейный пакет", value: 3 },
                  { label: "Сезонный абонемент", value: 4 },
                ]}
                values={selectedRecord.parkPromotions || []}
                onChange={(values) =>
                  setSelectedRecord({ ...selectedRecord, parkPromotions: values })
                }
              />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Время работы техподдержки
                </label>
                <div className="flex justify-between gap-4">
                  <div className="flex gap-2 items-center">
                    <span>С</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={startTime ?? ""}
                      onChange={handleStartTime}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span>До</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={endTime ?? ""}
                      onChange={handleEndTime}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between space-x-2">
              {isEditMode ? (
                <>
                  <button
                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                    onClick={updatePark}
                  >
                    Сохранить
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                    onClick={() => {
                      setIsEditMode(false);
                      const updatedPark = parks.find(
                        (item) => item.id === selectedRecord.id
                      );
                      if (updatedPark) {
                        setSelectedRecord(updatedPark);
                      }
                    }}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={() => setIsEditMode(true)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsViewEditModalOpen(false)}
                  >
                    Закрыть
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
UpdatePark.displayName = "UpdatePark";

export default UpdatePark;
