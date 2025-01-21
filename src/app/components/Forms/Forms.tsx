"use client";

import React, { useEffect, useState } from "react";
import CreatePark from "../CreatePark/CreatePark";
import UpdatePark from "../UpdatePark/UpdatePark";
import { Form } from "@/app/interfaces/interfaces";
// import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

type SortOrder = "asc" | "desc" | null;

interface FormTableProps {
  forms: Form[];
  total: number;
  page: number;
  totalPages: number;
}

const FormTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Form | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [parks, setParks] = useState<Form[]>([]);
  const [isViewEditModalOpen, setIsViewEditModalOpen] =
    useState<boolean>(false);

  const [newRecord, setNewRecord] = useState<
    Omit<Form, "id" | "Park" | "createdAt" | "updatedAt">
  >({
    name: "",
    formType: "taxiPark",
    phoneNumber: "",
  });

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

  const handleEditRecord = () => {
    if (selectedRecord) {
      setParks((prevData) =>
        prevData.map((item) =>
          item.id === selectedRecord.id ? selectedRecord : item
        )
      );
    }
    setIsViewEditModalOpen(false);
    setIsEditMode(false);
    setSelectedRecord(null);
  };

  const handleViewRecord = (record: Form) => {
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

  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/forms?page=${page}&limit=${limit}`
      );
      const result: FormTableProps = await response.json();
      console.log(result);
      setParks(result.forms);
      setTotalRecords(result.totalPages);
    } catch (error) {
      console.error("Ошибка при загрузке данных: ", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  useEffect(() => {
    if (sortConfig.key && sortConfig.order) {
      const sortedParks = [...parks].sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "Park") {
          aValue = a.Park?.title || "";
          bValue = b.Park?.title || "";
        } else {
          aValue = a[sortConfig.key!];
          bValue = b[sortConfig.key!];
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          const aDigits = aValue.toString().length;
          const bDigits = bValue.toString().length;
          if (aDigits !== bDigits) {
            return sortConfig.order === "asc"
              ? aDigits - bDigits
              : bDigits - aDigits;
          }
          return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "object" && typeof bValue === "object") {
          const aValue = a.Park?.title || "";
          const bValue = a.Park?.title || "";
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setParks(sortedParks);
    }
  }, [sortConfig]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Таксопарки</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Добавить таксопарк
      </button>

      <table className="w-full border-collapse border border-gray-300 text-sm overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Название
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
                Город
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
                Комиссия парка
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
                {i + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
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

      <div className="flex justify-between items-center mt-4">
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
          handleAddRecord={handleAddRecord}
        />
      )}

      {isViewEditModalOpen && selectedRecord && (
        <UpdatePark
          setIsViewEditModalOpen={setIsViewEditModalOpen}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          parks={parks}
          handleEditRecord={handleEditRecord}
        />
      )}
    </div>
  );
};

export default FormTable;
