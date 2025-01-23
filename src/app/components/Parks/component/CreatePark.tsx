import { Park } from "@/app/interfaces/interfaces";
import axios from "axios";
import React, { memo, useState } from "react";
import ModalDropdown from "../../ModalDropdown/ModalDropdown";

interface CreateParkProps {
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cities: any[];
  setParks: React.Dispatch<React.SetStateAction<Park[]>>;
}

const CreatePark: React.FC<CreateParkProps> = memo(
  ({ setIsCreateModalOpen, cities, setParks }) => {
    const [newRecord, setNewRecord] = useState<
      Omit<Park, "id" | "active" | "City">
    >({
      title: "",
      cityId: "",
      parkCommission: null,
      parkPromotions: [],
      paymentType: null,
      accountantSupport: null,
      commissionWithdraw: null,
      entrepreneurSupport: null,
      parkEntrepreneurSupport: null,
      paymentsByTransfer: null,
      rating: null,
      supportWorkTime: null,
      yandexGasStation: null,
    });

    console.log("newRecord", newRecord);

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

    const createPark = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/parks",
          newRecord
        );
        const createdPark = response.data;

        setParks((prevParks) => [...prevParks, createdPark]);
        setIsCreateModalOpen(false);
      } catch (error) {
        console.error("Ошибка при создании парка:", error);
        alert("Не удалось создать парк. Попробуйте снова.");
      } finally {
        setIsLoading(false);
      }
    };

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
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Город</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newRecord.cityId}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
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
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Рейтинг таксопарка
                </label>
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
            </div>
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Моментальные выплаты
                </label>
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
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Выплаты переводом
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newRecord.paymentsByTransfer ?? 0}
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
            </div>
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Комиссия парка, %
                </label>
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
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Комиссия за снятие средств
                </label>
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
            </div>
            <div className="flex justify-between gap-4">
              <ModalDropdown
                label="Яндекс заправки"
                value={newRecord.yandexGasStation}
                onChange={(value) =>
                  setNewRecord({ ...newRecord, yandexGasStation: value })
                }
              />
              <ModalDropdown
                label="Поддержка бухгалтерии"
                value={newRecord.accountantSupport}
                onChange={(value) =>
                  setNewRecord({ ...newRecord, accountantSupport: value })
                }
              />
            </div>
            <div className="flex justify-between gap-4">
              <ModalDropdown
                label="Поддержка ИП водителей"
                value={newRecord.entrepreneurSupport}
                onChange={(value) =>
                  setNewRecord({ ...newRecord, entrepreneurSupport: value })
                }
              />
              <ModalDropdown
                label="Поддержка паркового ИП"
                value={newRecord.parkEntrepreneurSupport}
                onChange={(value) =>
                  setNewRecord({ ...newRecord, parkEntrepreneurSupport: value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Бонусы</label>
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
            <div>
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
            <div className="flex justify-between">
              <button
                className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200"
                onClick={createPark}
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
  }
);

CreatePark.displayName = "CreatePark";

export default CreatePark;
