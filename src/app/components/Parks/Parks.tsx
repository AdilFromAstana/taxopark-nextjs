"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import CreatePark from "./component/CreatePark";
import UpdatePark from "./component/UpdatePark";
import {
  GetParks,
  Notification,
  Park,
  SortOrder,
} from "@/app/interfaces/interfaces";
// import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import NotificationBar from "../NotificationBar/NotificationBar";
import SaveExcelButton from "../SaveExcelButton/SaveExcelButton";
import { debounce } from "@/app/common/common";
import ModalDropdown from "./component/ModalDropdown";

interface TaxiParkTableProps {
  cities: any[];
}

const TaxiParkTable: React.FC<TaxiParkTableProps> = memo(({ cities }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Park | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [parks, setParks] = useState<Park[]>([]);
  const [isViewEditModalOpen, setIsViewEditModalOpen] =
    useState<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [yandexGasStation, setYandexGasStation] = useState<
    boolean | null | undefined
  >(null);

  const debouncedSetFilterCity = useCallback(
    debounce((value: string) => {
      setSelectedCity(value);
      fetchData({ filteredCity: value });
    }, 700),
    []
  );

  const debouncedSetFilterTitle = useCallback(
    debounce((value: string) => {
      setTitle(value);
      fetchData({ filteredTitle: value });
    }, 700),
    []
  );

  const debouncedSetFilterYandexGasStation = useCallback(
    debounce((value: boolean | null | undefined) => {
      setYandexGasStation(value);
      fetchData({ filteredYandexGasStation: value });
    }, 700),
    []
  );

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetFilterTitle(e.target.value);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Park | null;
    order: SortOrder;
  }>({ key: null, order: null });

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

  const fetchData = async ({
    filteredTitle = title,
    filteredCity = selectedCity,
    filteredYandexGasStation = yandexGasStation,
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/parks?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&filteredCity=${filteredCity}&filteredTitle=${filteredTitle}&filteredYandexGasStation=${filteredYandexGasStation}`
      );
      const result: GetParks = await response.json();
      setParks(result.parks);
      setTotalRecords(result.totalPages);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData({});
  }, [currentPage, limit, sortConfig]);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Таксопарки</h1>
          <button
            className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition duration-200 text-xl"
            onClick={() => setIsCreateModalOpen(true)}
          >
            +
          </button>
        </div>
        <SaveExcelButton
          dataType="parks"
          url={`http://localhost:5000/parks?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&filteredCity=${selectedCity}&filteredTitle=${title}&filteredYandexGasStation=${yandexGasStation}`}
        />
      </div>

      <div className="overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
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
                <input
                  type="text"
                  placeholder="Название таксопарка"
                  onChange={handleTitleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 font-normal"
                />
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
                <div className="w-full">
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    onChange={(e) => debouncedSetFilterCity(e.target.value)}
                  >
                    <option value="">Все города</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.title}
                      </option>
                    ))}
                  </select>
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
                <div>Яндекс заправки</div>
                <ModalDropdown
                  label=""
                  onChange={(value) => {
                    if (value !== undefined) {
                      debouncedSetFilterYandexGasStation(value);
                    }
                  }}
                />
              </th>
              <th className="border border-gray-300 px-4 py-2">Статус</th>
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
                  {item.active ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-200">
                      Активный
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200">
                      В архиве
                    </span>
                  )}
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
          setNotifications={setNotifications}
          setParks={setParks}
          setIsCreateModalOpen={setIsCreateModalOpen}
          cities={cities}
        />
      )}

      {isViewEditModalOpen && selectedRecord && (
        <UpdatePark
          setNotifications={setNotifications}
          cities={cities}
          setIsViewEditModalOpen={setIsViewEditModalOpen}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          setParks={setParks}
          parks={parks}
        />
      )}

      <NotificationBar notifications={notifications} />
    </div>
  );
});

TaxiParkTable.displayName = "TaxiParkTable";

export default TaxiParkTable;
