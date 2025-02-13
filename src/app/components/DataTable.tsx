"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { debounce } from "@/app/common/common";
import MultiSelect from "./Parks/component/MultiSelect";
import UpdateModal from "./UpdateModal";
import { City, EntityType, EntityWithStatus, GetParks, Park } from "../interfaces/interfaces";
import CreateModal from "./CreateModal";
import NotificationBar from "./NotificationBar/NotificationBar";

interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "dateRange" | "multiSelect" | "select";
  filterOptions?: { label: string; value: string }[];
}

interface FetchParams {
  page: number;
  limit: number;
  sort?: { key: string | string[] | null; order: "asc" | "desc" | null };
  filters?: Record<string, any>;
}

interface DataTableProps {
  fetchData: (params: FetchParams) => Promise<{ data: any[]; total: number, totalPages: number }>;
  selectedItem: { label: string; entityType: EntityType }
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc && acc[key] ? acc[key] : null, obj);
};

const entityFields: {
  [K in EntityWithStatus["entityType"]]: ColumnConfig<
    Extract<EntityWithStatus, { entityType: K }>
  >[];
} = {
  Parks: [
    { key: "title", label: "Имя" },
    { key: "Сity.title", label: "Город" },
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
    { key: "parkId", label: "Парк" },
    { key: "phoneNumber", label: "Номер телефона" },
  ],
  Promotions: [
    { key: "park", label: "Таксопарк" },
    { key: "title", label: "Название" },
    { key: "expires", label: "Активно до" },
    { key: "createdAt", label: "Создано" },
  ],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DataTable: React.FC<DataTableProps> = memo(({ fetchData, selectedItem }) => {
  const [data, setData] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [parks, setParks] = useState<Park[]>([]);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<
    EntityWithStatus
  >();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string | string[] | null; order: "asc" | "desc" | null }>({
    key: null,
    order: null,
  });

  const getParks = async () => {
    try {
      const response = await fetch(`${API_URL}/parks?page=1&limit=1000`);
      const result: GetParks = await response.json();

      setParks(result.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    }
  };

  const getCities = async () => {
    try {
      const response = await fetch(`${API_URL}/cities`);
      const result: City[] = await response.json();

      setCities(result);
    } catch (e) {
      console.error(e);
    }
  };

  const debouncedFetchData = useCallback(
    debounce(async (params: FetchParams) => {
      setIsLoading(true);
      try {
        const { data, total, totalPages } = await fetchData(params);
        setData(data);
        setTotalRecords(total);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [fetchData, selectedItem]
  );

  useEffect(() => {
    debouncedFetchData({
      page: 1,
      limit,
      sort: sortConfig,
      filters: {},
    });
  }, [selectedItem]);

  const handleSort = (key: string | string[]) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key ? (prev.order === "asc" ? "desc" : "asc") : "asc",
    }));
  };

  const handleFilterChange = (key: string | string[], value: any) => {
    setFilters((prev) => ({
      ...prev,
      [Array.isArray(key) ? key.join(".") : key]: value,
    }));
    debouncedFetchData({
      page: currentPage,
      limit,
      sort: sortConfig,
      filters: {
        ...filters,
        [Array.isArray(key) ? key.join(".") : key]: value,
      },
    });
  };

  useEffect(() => {
    getParks()
    getCities()
  }, [])

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{selectedItem.label}</h1>
          {
            selectedItem.entityType !== "Forms" &&
            <button
              className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition duration-200 text-xl"
              onClick={() => setIsCreateModalOpen(true)}
            >
              +
            </button>
          }
        </div>
      </div>

      <div className="overflow-auto flex-1">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-10">#</th>
              {entityFields[selectedItem.entityType].map((col) => (
                <th
                  key={Array.isArray(col.key) ? col.key.join(".") : col.key}
                  className="border border-gray-300 px-4 py-2"
                >
                  <div
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable &&
                      sortConfig.key === col.key &&
                      (sortConfig.order === "asc" ? (
                        <GoSortAsc fontSize="20px" />
                      ) : (
                        <GoSortDesc fontSize="20px" />
                      ))}
                    {col.sortable && sortConfig.key !== col.key && (
                      <BiSortAlt2 fontSize="20px" />
                    )}
                  </div>
                  {col.filterable && col.filterType === "text" && (
                    <input
                      placeholder={col.label}
                      className="w-full border border-gray-300 rounded-lg p-2 font-normal"
                      onChange={(e) =>
                        handleFilterChange(col.key, e.target.value)
                      }
                    />
                  )}
                  {col.filterable &&
                    col.filterType === "multiSelect" &&
                    col.filterOptions && (
                      <MultiSelect
                        label={col.label}
                        options={col.filterOptions}
                        values={
                          filters[
                          Array.isArray(col.key) ? col.key.join(".") : col.key
                          ] || []
                        }
                        onChange={(values) =>
                          handleFilterChange(
                            Array.isArray(col.key)
                              ? col.key.join(".")
                              : col.key,
                            values
                          )
                        }
                      />
                    )}
                  {col.filterable &&
                    col.filterType === "select" &&
                    col.filterOptions && (
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        onChange={(e) =>
                          handleFilterChange(col.key, e.target.value)
                        }
                      >
                        <option value="">Выберите...</option>
                        {col.filterOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  {col.filterable && col.filterType === "dateRange" && (
                    <div className="flex flex-row justify-center gap-2">
                      <input
                        type="date"
                        className="border border-gray-300 rounded p-1"
                        onChange={(e) =>
                          handleFilterChange(`${col.key}.from`, e.target.value)
                        }
                      />
                      <input
                        type="date"
                        className="border border-gray-300 rounded p-1"
                        onChange={(e) =>
                          handleFilterChange(`${col.key}.to`, e.target.value)
                        }
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50"
                onClick={() => {
                  setSelectedRecord({ ...item, entityType: selectedItem.entityType });
                  setIsViewEditModalOpen(true);
                }}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(currentPage - 1) * limit + i + 1}
                </td>
                {entityFields[selectedItem.entityType].map((col) => {
                  const value = getNestedValue(item, col.key);
                  if (col.key === "Сity.title")
                    console.log("value: ", value)
                  return (
                    <td
                      key={col.key}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {col.render ? col.render(value, item) : value ?? "—"}
                    </td>
                  );
                })}
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
          Страница {currentPage} из {Math.ceil(totalRecords / limit)}
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
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(totalRecords / limit))
              )
            }
            disabled={currentPage === Math.ceil(totalRecords / limit)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      </div>

      {isViewEditModalOpen && selectedRecord && (
        <UpdateModal
          cities={cities}
          parks={parks}
          setIsViewEditModalOpen={setIsViewEditModalOpen}
          selectedRecord={selectedRecord}
        />
      )}

      {isCreateModalOpen && <CreateModal
        cities={cities}
        parks={parks}
        setData={setData}
        entityType={selectedItem.entityType}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />}

      <NotificationBar />
    </div>
  );
});

DataTable.displayName = "DataTable";

export default DataTable;
