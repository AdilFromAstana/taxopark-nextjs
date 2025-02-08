"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { debounce } from "@/app/common/common";
import CreatePromotion from "@/app/components/PromotionsTable/component/CreatePromotion";
import NotificationBar from "@/app/components/NotificationBar/NotificationBar";
import { Notification, Park } from "@/app/interfaces/interfaces";
import SaveExcelButton from "../SaveExcelButton/SaveExcelButton";

interface Promotion {
    id: number;
    title: string;
    taxiPark: string;
    description: string;
    startDate: string;
    expires: string | null;
    active: boolean;
}

interface PromotionsTableProps {
    parks: Park[]
}

const PromotionsTable: React.FC<PromotionsTableProps> = memo(({ parks }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [parkId, setParkId] = useState<string>("");
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Promotion | null; order: "asc" | "desc" | null }>({
        key: null,
        order: null,
    });

    const debouncedSetSearchTitle = useCallback(
        debounce((value: string) => {
            setSearchTitle(value);
            fetchData({ searchTitle: value });
        }, 700),
        []
    );

    const handleSort = (key: keyof Promotion) => {
        setSortConfig((prevConfig) => {
            const newOrder =
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

    const fetchData = async ({ searchTitle = "" }) => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `http://localhost:5000/promotions?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&searchTitle=${searchTitle}`
            );
            const result = await response.json();
            setPromotions(result.promotions);
            setTotalRecords(result.totalPages);
        } catch (error) {
            setPromotions([])
            setTotalRecords(0)
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
                    <h1 className="text-2xl font-bold">Акции и бонусы</h1>
                    <button
                        className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition duration-200 text-xl"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                <SaveExcelButton
                    dataType="parks"
                    url={`http://localhost:5000/parks?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&parkId=${parkId}`}
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
                                    Название акции
                                    {sortConfig.key === "title" && sortConfig.order ? (
                                        sortConfig.order === "asc" ? <GoSortAsc fontSize="20px" /> : <GoSortDesc fontSize="20px" />
                                    ) : (
                                        <BiSortAlt2 fontSize="20px" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Название акции"
                                    onChange={(e) => debouncedSetSearchTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 font-normal"
                                />
                            </th>
                            <th className="border border-gray-300 px-4 py-2">Таксопарк</th>
                            <th className="border border-gray-300 px-4 py-2">Срок действия</th>
                            <th className="border border-gray-300 px-4 py-2">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((item, i) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2 text-center">{(currentPage - 1) * limit + i + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.taxiPark}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.expires || "Без срока"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.active ? (
                                        <span className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-200">Активна</span>
                                    ) : (
                                        <span className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200">Завершена</span>
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

                <div>Страница {currentPage} из {totalRecords}</div>

                <div className="space-x-2">
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Назад</button>
                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalRecords))} disabled={currentPage === totalRecords} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Вперед</button>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreatePromotion
                    setNotifications={setNotifications}
                    setPromotions={setPromotions}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    parks={parks}
                />
            )}

            <NotificationBar notifications={notifications} />
        </div>
    );
});

PromotionsTable.displayName = "PromotionsTable";

export default PromotionsTable;
