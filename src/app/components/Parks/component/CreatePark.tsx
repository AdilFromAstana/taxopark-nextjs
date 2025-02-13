import { Park } from "@/app/interfaces/interfaces";
import axios from "axios";
import React, { memo, useState } from "react";
import ModalDropdown from "./Dropdown";
import MultiSelect from "./MultiSelect";
import TextInput from "./TextInput";
import { useNotifications } from "@/app/context/NotificationContext";

interface CreateParkProps {
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cities: any[];
  setParks: React.Dispatch<React.SetStateAction<Park[]>>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CreatePark: React.FC<CreateParkProps> = memo(
  ({ setIsCreateModalOpen, cities, setParks }) => {
    const { addNotification } = useNotifications();
    const [newRecord, setNewRecord] = useState<
      Omit<Park, "id" | "active" | "City" | "createdAt" | "updatedAt">
    >({
      title: "",
      cityId: "",
      parkCommission: 0,
      parkPromotions: [],
      paymentType: null,
      accountantSupport: null,
      commissionWithdraw: null,
      entrepreneurSupport: null,
      parkEntrepreneurSupport: null,
      transferPaymentCommission: null,
      rating: null,
      supportWorkTime: null,
      yandexGasStation: null,
      averageCheck: 0,
    });

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
        const response = await axios.post(`${API_URL}/parks`, newRecord);
        const createdPark = response.data;
        if (!createdPark) {
          throw new Error("Некорректный ответ сервера");
        }
        setParks((prevParks) => [...prevParks, createdPark]);
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg w-[75vw] p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">Добавить таксопарк</h2>
          <div className="grid grid-cols-3 gap-4">
            <TextInput
              value={newRecord.title}
              label="Название"
              onChange={(value) => setNewRecord({ ...newRecord, title: value })}
            />
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
            <TextInput
              value={newRecord.commissionWithdraw ?? 0}
              label="Моментальные выплаты"
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setNewRecord({
                    ...newRecord,
                    commissionWithdraw: value === "" ? null : Number(value),
                  });
                }
              }}
            />
            <TextInput
              value={newRecord.transferPaymentCommission ?? 0}
              label="Выплаты переводом"
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setNewRecord({
                    ...newRecord,
                    transferPaymentCommission:
                      value === "" ? null : Number(value),
                  });
                }
              }}
            />
            <TextInput
              value={newRecord.parkCommission ?? 0}
              label="Комиссия парка, %"
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setNewRecord({
                    ...newRecord,
                    parkCommission: value === "" ? 0 : Number(value),
                  });
                }
              }}
            />
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
            <MultiSelect
              label="Бонусы"
              options={[
                { label: "Гарантированные бонусы", value: 1 },
                { label: "Приветственные бонусы", value: 2 },
                { label: "Розыгрыш", value: 3 },
                { label: "Бонус за активность", value: 4 },
                { label: "Приведи друга", value: 5 },
              ]}
              values={newRecord.parkPromotions || []}
              onChange={(values) =>
                setNewRecord({ ...newRecord, parkPromotions: values })
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
    );
  }
);

CreatePark.displayName = "CreatePark";

export default CreatePark;
