"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { GetPromotions, Promotion, SortOrder } from "@/app/interfaces/interfaces";
import { BiSortAlt2 } from "react-icons/bi";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import NotificationBar from "../NotificationBar/NotificationBar";
import SaveExcelButton from "../SaveExcelButton/SaveExcelButton";
import { debounce } from "@/app/common/common";
import CreatePromotion from "./component/CreatePromotion";
import UpdatePromotion from "./component/UpdatePromotion";
import SearchableDropdown from "../SearchableDropdown";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TableProps {
    parks: any[];
}

const PromotionTable: React.FC<TableProps> = memo(({ parks }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<Promotion | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState<boolean>(false);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const [title, setTitle] = useState<string>("");
    const [park, setPark] = useState<string>("");

    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetFilterTitle(e.target.value);
    };

    const debouncedSetFilterTitle = useCallback(
        debounce((value: string) => {
            setTitle(value);
            fetchData({ filteredTitle: value });
        }, 700),
        []
    );

    const debouncedSetFilterPark = useCallback(
        debounce((value: string) => {
            setPark(value);
            fetchData({ filteredCompany: value });
        }, 700),
        []
    );

    const [sortConfig, setSortConfig] = useState<{ key: keyof Promotion | null; order: SortOrder; }>({
        key: null,
        order: null,
    });

    const handleSort = (key: keyof Promotion) => {
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

    const fetchData = async ({ filteredTitle = title, filteredCompany = park }) => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${API_URL}/promotions?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&filteredTitle=${filteredTitle}&filteredPark=${park}`
            );
            const result: GetPromotions = await response.json();
            setPromotions(result.data);
            setTotalRecords(result.totalPages);
        } catch (error) {
            console.error("Ошибка при загрузке данных: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewRecord = (record: Promotion) => {
        setSelectedRecord(record);
        setIsEditMode(false);
        setIsViewEditModalOpen(true);
    };

    useEffect(() => {
        fetchData({});
    }, [currentPage, limit, sortConfig]);

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Промоакции</h1>
                    <button
                        className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition duration-200 text-xl"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                <SaveExcelButton
                    dataType="promotions"
                    url={`${API_URL}/promotions?page=${currentPage}&limit=${limit}&sortField=${sortConfig.key}&sortOrder=${sortConfig.order}&filteredPark=${park}&filteredTitle=${title}`}
                />
            </div>
            <div className="overflow-auto">
                {isLoading && <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">Загрузка...</div>}
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
                                <div className="w-full">
                                    <SearchableDropdown
                                        value={park}
                                        onChange={(value) => debouncedSetFilterPark(value)}
                                        apiUrl={`${API_URL}/parks/getByName`}
                                    />
                                </div>

                            </th>
                            <th className="border border-gray-300 px-4 py-2">Описание</th>
                            <th className="border border-gray-300 px-4 py-2">Дата окончания</th>
                            <th className="border border-gray-300 px-4 py-2">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((item, i) => (
                            <tr key={item.id} className="hover:bg-gray-50" onClick={() => handleViewRecord(item)}>
                                <td className="border border-gray-300 px-4 py-2 text-center">{(currentPage - 1) * limit + i + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.Park.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.expires ? item.expires : "Неограничено"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.active ? "Активная" : "Неактивная"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCreateModalOpen && <CreatePromotion setPromotions={setPromotions} setIsCreateModalOpen={setIsCreateModalOpen} parks={parks} />}
            {isViewEditModalOpen && selectedRecord && <UpdatePromotion setSelectedRecord={setSelectedRecord} setPromotions={setPromotions} parks={parks} setIsEditMode={setIsEditMode} isEditMode={isEditMode} promotions={promotions} setIsViewEditModalOpen={setIsViewEditModalOpen} selectedRecord={selectedRecord} />}
            <NotificationBar />
        </div>
    );
});

PromotionTable.displayName = "PromotionTable";

export default PromotionTable;
