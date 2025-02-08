"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Form,
  GetForms,
  GetFormsParams,
  GetParks,
  Park,
  SortOrder,
} from "@/app/interfaces/interfaces";
// import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import UpdateForm from "./components/UpdateForm";
import MultiSelect from "../Parks/component/MultiSelect";
import SaveExcelButton from "../SaveExcelButton/SaveExcelButton";
import { debounce, formatPhoneNumber } from "@/app/common/common";

const FormTable: React.FC = memo(() => {
  const [selectedRecord, setSelectedRecord] = useState<Form | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<Form[]>([]);
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isViewEditModalOpen, setIsViewEditModalOpen] =
    useState<boolean>(false);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Form | null;
    order: SortOrder;
  }>({ key: null, order: null });

  const handleSort = (key: keyof Form) => {
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

  const handleViewRecord = (record: Form) => {
    setSelectedRecord(record);
    setIsViewEditModalOpen(true);
  };

  const getParks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/parks?page=1&limit=1000`
      );
      const result: GetParks = await response.json();

      setParks(result.parks);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParkChange = (values: string[]) => {
    setSelectedParks(values);
    debouncedFetchForms(values);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetFilterName(e.target.value);
  };

  const debouncedFetchForms = useCallback(
    debounce((parks: string[]) => {
      fetchData({ filteredParks: parks });
    }, 700),
    []
  );

  const debouncedSetFilterStartDate = useCallback((value: string) => {
    selectStartDate(value);
    fetchData({ filterStartDate: value });
  }, []);

  const debouncedSetFilterEndDate = useCallback((value: string) => {
    setEndDate(value);
    fetchData({ filterEndDate: value });
  }, []);

  const debouncedSetFilterName = useCallback(
    debounce((value: string) => {
      setName(value);
      fetchData({ filterName: value });
    }, 700),
    []
  );

  const fetchData = async ({
    filteredParks = selectedParks,
    filterName = name,
    filterStartDate = startDate,
    filterEndDate = endDate,
  }: GetFormsParams) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/forms?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key
        }&sortOrder=${sortConfig.order}&selectedParks=${filteredParks.join(
          ","
        )}&filterName=${filterName}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}`
      );
      const result: GetForms = await response.json();

      setForms(
        result.forms.map((form) => ({
          ...form,
          phoneNumber: formatPhoneNumber(form.phoneNumber),
        }))
      );
      console.log("result.totalPages: ", result.totalPages);
      setTotalRecords(result.totalPages);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStartDate = (value: string) => {
    setStartDate(value);
    if (!endDate) setEndDate("");
  };

  const calculateMinEndDate = (date: string): string => {
    if (!date) return "";
    const start = new Date(date);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchData({});
  }, [currentPage, limit, sortConfig]);

  useEffect(() => {
    getParks();
  }, []);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заявки</h1>
        <SaveExcelButton
          dataType="forms"
          url={`http://localhost:5000/forms?page=${currentPage}&limit=10000&sortField=${sortConfig.key
            }&sortOrder=${sortConfig.order}&selectedParks=${selectedParks.join(
              ","
            )}&filterName=${name}&filterStartDate=${startDate}&filterEndDate=${endDate}`}
        />
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
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  ФИО
                  {sortConfig.key === "name" && sortConfig.order ? (
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
                  placeholder="Имя"
                  className="w-full border border-gray-300 rounded-lg p-2 font-normal"
                  onChange={handleNameInputChange}
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 w-96">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("Park")}
                >
                  Таксопарк
                  {sortConfig.key === "Park" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
                <MultiSelect
                  values={selectedParks}
                  onChange={handleParkChange}
                  options={parks.map((park) => {
                    return {
                      label: park.title,
                      value: park.id,
                    };
                  })}
                />
              </th>
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("phoneNumber")}
                >
                  Номер телефона
                  {sortConfig.key === "phoneNumber" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
                <input placeholder="Номер телефона" className="w-full p-2" />
              </th>
              <th className="border border-gray-300 px-4 py-2">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Время отправки
                  {sortConfig.key === "createdAt" && sortConfig.order ? (
                    sortConfig.order === "asc" ? (
                      <GoSortAsc fontSize="20px" />
                    ) : (
                      <GoSortDesc fontSize="20px" />
                    )
                  ) : (
                    <BiSortAlt2 fontSize="20px" />
                  )}
                </div>
                <div className="flex gap-4 justify-center items-center">
                  <div className="flex gap-2 items-center">
                    <span>С</span>
                    <input
                      onChange={(e) =>
                        debouncedSetFilterStartDate(e.target.value)
                      }
                      type="date"
                      max={endDate}
                      className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={startDate}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span>До</span>
                    <input
                      onChange={(e) =>
                        debouncedSetFilterEndDate(e.target.value)
                      }
                      type="date"
                      min={calculateMinEndDate(startDate)}
                      className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={endDate}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {forms.map((item, i) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50"
                onClick={() => handleViewRecord(item)}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(currentPage - 1) * limit + i + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.Park ? item.Park.title : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.phoneNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "Нет данных"}
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

      {isViewEditModalOpen && selectedRecord && (
        <UpdateForm
          setIsViewEditModalOpen={setIsViewEditModalOpen}
          selectedRecord={selectedRecord}
        />
      )}
    </div>
  );
});

FormTable.displayName = "FormTable";

export default FormTable;
