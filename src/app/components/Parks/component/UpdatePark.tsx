import { Notification, Park } from "@/app/interfaces/interfaces";
import { memo, useState } from "react";
import ModalDropdown from "./ModalDropdown";
import MultiSelect from "./MultiSelect";
import TextInput from "./TextInput";
import axios from "axios";

interface UpdateParkProps {
  setIsViewEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: Park;
  setSelectedRecord: React.Dispatch<React.SetStateAction<Park | null>>;
  parks: Park[];
  cities: any[];
  setParks: React.Dispatch<React.SetStateAction<Park[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const UpdatePark: React.FC<UpdateParkProps> = memo(
  ({
    setIsViewEditModalOpen,
    isEditMode,
    setIsEditMode,
    selectedRecord,
    setSelectedRecord,
    parks,
    cities = [],
    setParks,
    setNotifications,
  }) => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const addNotification = (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);

      setNotifications((prev) => {
        return [...prev, { ...notification, id }];
      });

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n: Notification) => n.id !== id)
        );
      }, 5000);
    };

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

    const changeStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axios.put(
          `http://localhost:5000/parks/${selectedRecord.id}`,
          { active: !selectedRecord.active }
        );
        const updatedPark = response.data;
        setParks((prevParks) =>
          prevParks.map((park) =>
            park.id === selectedRecord.id ? { ...park, ...updatedPark } : park
          )
        );
        setSelectedRecord({
          ...selectedRecord,
          active: updatedPark.active,
        });
        addNotification({
          type: "success",
          message: `Таксопарк ${
            updatedPark.active ? "активирован" : "архивирован"
          }!`,
        });
      } catch (error: any) {
        console.error("Ошибка при обновлении парка:", error);
        addNotification({
          type: "error",
          message:
            error.message || "Произошла ошибка при добавлении таксопарка",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const updatePark = async () => {
      if (selectedRecord) {
        try {
          setIsLoading(true);
          const response = await axios.put(
            `http://localhost:5000/parks/${selectedRecord.id}`,
            selectedRecord
          );
          const updatedPark = response.data;
          setParks((prevParks) =>
            prevParks.map((park) =>
              park.id === selectedRecord.id ? { ...park, ...updatedPark } : park
            )
          );
          addNotification({
            type: "success",
            message: "Таксопарк успешно обновлен!",
          });
          setIsViewEditModalOpen(false);
          setSelectedRecord(null);
        } catch (error: any) {
          console.error("Ошибка при обновлении парка:", error);
          addNotification({
            type: "error",
            message:
              error.message || "Произошла ошибка при добавлении таксопарка",
          });
          alert("Не удалось обновить парк. Попробуйте снова.");
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
        <div className="bg-white rounded-lg shadow-lg w-[75vw] p-6">
          <div className="flex mb-4 gap-2">
            <h2 className="text-xl font-bold">
              {isEditMode ? "Редактировать таксопарк" : "Просмотр таксопарка"}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                value={selectedRecord.title}
                label="Название"
                onChange={(value) =>
                  setSelectedRecord({ ...selectedRecord, title: value })
                }
                disabled={!isEditMode}
              />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Город</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  style={{
                    backgroundColor: !isEditMode
                      ? "rgba(239, 239, 239, 0.3)"
                      : "white",
                  }}
                  value={selectedRecord.cityId}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      cityId: e.target.value,
                    })
                  }
                  disabled={!isEditMode}
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
                  setSelectedRecord({
                    ...selectedRecord,
                    entrepreneurSupport: value,
                  })
                }
                disabled={!isEditMode}
              />
              <ModalDropdown
                label="Поддержка паркового ИП"
                value={selectedRecord.parkEntrepreneurSupport}
                onChange={(value) =>
                  setSelectedRecord({
                    ...selectedRecord,
                    parkEntrepreneurSupport: value,
                  })
                }
                disabled={!isEditMode}
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
                disabled={!isEditMode}
              />
              <TextInput
                value={selectedRecord.transferPaymentCommission ?? 0}
                label="Выплаты переводом"
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setSelectedRecord({
                      ...selectedRecord,
                      transferPaymentCommission:
                        value === "" ? null : Number(value),
                    });
                  }
                }}
                disabled={!isEditMode}
              />
              <TextInput
                value={selectedRecord.parkCommission ?? 0}
                label="Комиссия парка, %"
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setSelectedRecord({
                      ...selectedRecord,
                      parkCommission: value === "" ? 0 : Number(value),
                    });
                  }
                }}
                disabled={!isEditMode}
              />
              <ModalDropdown
                label="Яндекс заправки"
                value={selectedRecord.yandexGasStation}
                onChange={(value) =>
                  setSelectedRecord({
                    ...selectedRecord,
                    yandexGasStation: value,
                  })
                }
                disabled={!isEditMode}
              />
              <ModalDropdown
                label="Поддержка бухгалтерии"
                value={selectedRecord.accountantSupport}
                onChange={(value) =>
                  setSelectedRecord({
                    ...selectedRecord,
                    accountantSupport: value,
                  })
                }
                disabled={!isEditMode}
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
                values={selectedRecord.parkPromotions || []}
                onChange={(values) =>
                  setSelectedRecord({
                    ...selectedRecord,
                    parkPromotions: values,
                  })
                }
                disabled={!isEditMode}
              />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Время работы техподдержки
                </label>
                <div className="flex justify-between gap-4">
                  <div className="flex gap-2 items-center">
                    <span>С</span>
                    <input
                      disabled={!isEditMode}
                      placeholder="00:00"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 h-10"
                      value={startTime ?? ""}
                      onChange={handleStartTime}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span>До</span>
                    <input
                      disabled={!isEditMode}
                      placeholder="00:00"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 h-10"
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
                        onClick={changeStatus}
                      >
                        Архивировать
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-200"
                        onClick={changeStatus}
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
          </div>
        </div>
      </div>
    );
  }
);
UpdatePark.displayName = "UpdatePark";

export default UpdatePark;
