"use client";

import React, { memo, useEffect, useState } from "react";
import CreatePark from "./component/CreatePark";
import UpdatePark from "./component/UpdatePark";
import { Park } from "@/app/interfaces/interfaces";
// import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import axios from "axios";

type SortOrder = "asc" | "desc" | null;

interface TaxiParkTableProps {
  cities: any[];
}
interface GetParks {
  parks: Park[];
  total: number;
  page: number;
  totalPages: number;
}

const TaxiParkTable: React.FC<TaxiParkTableProps> = memo(({ cities }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Park | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [parks, setParks] = useState<Park[]>([]);
  const [isViewEditModalOpen, setIsViewEditModalOpen] =
    useState<boolean>(false);

  const [newRecord, setNewRecord] = useState<
    Omit<Park, "id" | "active" | "City">
  >({
    title: "",
    cityId: "",
    commissionWithdraw: 0,
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Park | null;
    order: SortOrder;
  }>({ key: null, order: null });

  const updatePark = async () => {
    if (selectedRecord) {
      try {
        setIsLoading(true);
        const response = await axios.put(
          `http://localhost:5000/api/parks/${selectedRecord.id}`,
          selectedRecord
        );
        const updatedPark = response.data;

        setParks((prevParks) =>
          prevParks.map((park) =>
            park.id === selectedRecord.id ? { ...park, ...updatedPark } : park
          )
        );

        setIsViewEditModalOpen(false); // Закрываем модальное окно после обновления
        setSelectedRecord(null); // Очищаем выбранную запись
      } catch (error) {
        console.error("Ошибка при обновлении парка:", error);
        alert("Не удалось обновить парк. Попробуйте снова.");
      } finally {
        setIsLoading(false);
      }
    }
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

  const handleSort = (key: keyof Park) => {
    setSortConfig((prevConfig) => {
      const newOrder: SortOrder =
        prevConfig.key === key
          ? prevConfig.order === "asc"
            ? "desc"
            : prevConfig.order === "desc"
            ? null
            : "asc"
          : "asc";

      return { key, order: newOrder };
    });
  };

  const handleViewRecord = (record: Park) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setIsViewEditModalOpen(true);
  };

  const handleArchiveRecord = (id: string) => {
    setParks((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, archived: true } : item
      )
    );
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/parks?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}`
      );
      const result: GetParks = await response.json();
      console.log(result);
      setParks(result.parks);
      setTotalRecords(result.totalPages);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    }
  };

  const handleAddRecord = (e) => console.log(e);

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, sortConfig]);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Таксопарки</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Добавить таксопарк
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Название
                  {sortConfig.key === "title" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("City")}
                >
                  Город
                  {sortConfig.key === "City" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("parkCommission")}
                >
                  Комиссия парка
                  {sortConfig.key === "parkCommission" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Яндекс заправки
              </th>
              <th className="border border-gray-300 px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {parks.map((item, i) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50"
                onClick={() => handleViewRecord(item)}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(currentPage - 1) * limit + i + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.City ? item.City.title : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.parkCommission}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.yandexGasStation ? "Да" : "Нет"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => handleArchiveRecord(item.id)}
                  >
                    Архивировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <div>
          <span>Показывать:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="ml-2 border border-gray-300 rounded p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div>
          Страница {currentPage} из {totalRecords}
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Назад
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalRecords))
            }
            disabled={currentPage === totalRecords}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreatePark
          newRecord={newRecord}
          setNewRecord={setNewRecord}
          setIsCreateModalOpen={setIsCreateModalOpen}
          createPark={createPark}
          cities={cities}
        />
      )}

      {isViewEditModalOpen && selectedRecord && (
        <UpdatePark
          cities={cities}
          setIsViewEditModalOpen={setIsViewEditModalOpen}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          parks={parks}
          updatePark={updatePark}
        />
      )}
    </div>
  );
});

TaxiParkTable.displayName = "TaxiParkTable";

export default TaxiParkTable;
