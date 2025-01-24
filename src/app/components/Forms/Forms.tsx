"use client";

import React, { memo, useEffect, useState } from "react";
import { Form, SortOrder } from "@/app/interfaces/interfaces";
// import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import UpdateForm from "./components/UpdateForm";

interface FormTableProps {
  cities: any[];
}

interface GetForms {
  forms: Form[];
  total: number;
  page: number;
  totalPages: number;
}

const FormTable: React.FC<FormTableProps> = memo(() => {
  const [selectedRecord, setSelectedRecord] = useState<Form | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<Form[]>([]);
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/forms?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}`
      );
      const result: GetForms = await response.json();
      setForms(result.forms);
      setTotalRecords(result.totalPages);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, sortConfig]);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заявки</h1>
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
              </th>
              <th className="border border-gray-300 px-4 py-2">
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
