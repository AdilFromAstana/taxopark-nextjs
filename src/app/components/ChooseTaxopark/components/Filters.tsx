"use clinet";

import React, { memo, useEffect, useRef, useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { LuClock3, LuGift } from "react-icons/lu";
import { FiHeadphones } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { GetParks, Park, SortOrder } from "@/app/interfaces/interfaces";

interface FiltersProps {
  setFilteredItems: React.Dispatch<React.SetStateAction<unknown[]>>;
  setTotalRecords: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters: React.FC<FiltersProps> = memo(
  ({ setFilteredItems, setIsLoading, setTotalRecords }) => {
    const [supportTimeFilters, setSupportTimeFilters] = useState<{
      allDay: boolean;
      limited: boolean;
    }>({
      allDay: false,
      limited: false,
    });

    const handleSupportTimeFilters = (
      filterType: keyof typeof supportTimeFilters
    ) => {
      setSupportTimeFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: !prevFilters[filterType], // Переключаем состояние выбранного фильтра
      }));
    };

    const [workDays, setWorkDays] = useState(0);
    const [orderPerDay, setOrderPerDay] = useState(0);
    const yandexCommission = 7;

    const [parkPromotions, setParkPromotions] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [isPaymentWithCommission, setIsPaymentWithCommission] =
      useState(false);

    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const allParkPromotions = [
      "Гарантированные бонусы",
      "Приветственные бонусы",
      "Розыгрыш",
      "Бонус за активность",
      "Приведи друга",
    ];

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/parks?page=1&limit=1000`
        );
        const result: GetParks = await response.json();
        const updatedParks = result.parks.map((park) => {
          return {
            ...park,
            approximateIncome:
              workDays * orderPerDay * park.averageCheck -
              ((yandexCommission + park.parkCommission) / 100) *
                (workDays * orderPerDay * park.averageCheck),
          };
        });
        setFilteredItems(updatedParks);
        setTotalRecords(result.totalPages);
      } catch (error) {
        console.error("Ошибка при загрузке данных: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debouncedFilter = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Очистить предыдущий таймер
      }
      debounceTimeout.current = setTimeout(() => {
        fetchData();
      }, 700);
    };

    useEffect(() => {
      debouncedFilter();
      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
      };
    }, [
      workDays,
      orderPerDay,
      parkPromotions,
      isPaymentWithCommission,
      selectedCity,
      supportTimeFilters,
    ]);

    return (
      <div className="bg-white">
        <div>
          <h2 className="text-lg font-bold mb-4">Расчитать доход</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 mb-2">
              Кол-во дней в парке
              <MdOutlineCalendarToday />
            </label>
            <input
              type="range"
              min={0}
              max={30}
              value={workDays}
              onChange={(e) => setWorkDays(Number(e.target.value))}
              className="w-full"
            />
            <span className="block mt-2 font-bold">{workDays}</span>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              Выплаты <LuClock3 />
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPaymentWithCommission}
                  onChange={() => setIsPaymentWithCommission(true)}
                  className="mr-2"
                />
                С комиссией
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!isPaymentWithCommission}
                  onChange={() => setIsPaymentWithCommission(false)}
                  className="mr-2"
                />
                Без комиссии
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              Техподдержка <FiHeadphones />
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={supportTimeFilters.allDay}
                  onChange={() => handleSupportTimeFilters("allDay")}
                  className="mr-2"
                />
                Круглосуточно
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={supportTimeFilters.limited}
                  onChange={() => handleSupportTimeFilters("limited")}
                  className="mr-2"
                />
                Ограниченное время
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              Кол-во заказов в день <FaCarSide />
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={orderPerDay}
              onChange={(e) => setOrderPerDay(Number(e.target.value))}
              className="w-full"
            />
            <span className="block mt-2 font-bold">{orderPerDay}</span>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              Акции парка <LuGift />
            </label>
            <div className="flex flex-wrap gap-2">
              {allParkPromotions.map((promotion) => (
                <label key={promotion} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={parkPromotions.includes(promotion)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setParkPromotions([...parkPromotions, promotion]);
                      } else {
                        setParkPromotions(
                          parkPromotions.filter((item) => item !== promotion)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  {promotion}
                </label>
              ))}
            </div>
          </div>

          {/* Город */}
          {/* <div>
          <label className="flex items-center gap-2 mb-2">
            Город <FaLocationDot />
          </label>
          <select
            value={selectedCity || ""}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Выберите город</option>
            {allCities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div> */}
        </div>
      </div>
    );
  }
);

Filters.displayName = "Filters";

export default Filters;
