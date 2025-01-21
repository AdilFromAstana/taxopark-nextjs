"use clinet";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { LuClock3, LuGift } from "react-icons/lu";
import { FiHeadphones } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

interface FiltersProps {
  setFilteredItems: React.Dispatch<React.SetStateAction<unknown[]>>;
}

const Filters: React.FC<FiltersProps> = ({ setFilteredItems, parks }) => {
  const items = [
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "Яндекс.Такси",
      paymentType: "Безналичный расчет",
      supportWorkTime: "Круглосуточно",
      commissionWithdraw: "1% при выводе на карту",
      parkPromotions: ["Приветственные бонусы"],
      commission: 15,
      city: "Астана",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "Ситимобил",
      paymentType: "Банковская карта",
      supportWorkTime: "08:00 - 22:00",
      commissionWithdraw: "0.5% на карту",
      parkPromotions: ["Бонус за активность"],
      commission: 12,
      city: "Алматы",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "Убер",
      paymentType: "Безналичный расчет",
      supportWorkTime: "Круглосуточно",
      commissionWithdraw: "1% на карту",
      parkPromotions: ["Гарантированные бонусы"],
      commission: 14,
      city: "Шымкент",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "Такси.Ру",
      paymentType: "Снятие наличных",
      supportWorkTime: "06:00 - 00:00",
      commissionWithdraw: "0%",
      parkPromotions: ["Приведи друга"],
      commission: 10,
      city: "Астана",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "ГетТакси",
      paymentType: "Безналичный расчет",
      supportWorkTime: "07:00 - 23:00",
      commissionWithdraw: "0.8% на карту",
      parkPromotions: ["Розыгрыш"],
      commission: 13,
      city: "Алматы",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "Таксопарк",
      paymentType: "Снятие наличных",
      supportWorkTime: "09:00 - 21:00",
      commissionWithdraw: "1.2% при выводе",
      parkPromotions: ["Приветственные бонусы"],
      commission: 11,
      city: "Шымкент",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "ВезетТакси",
      paymentType: "Банковская карта",
      supportWorkTime: "06:00 - 22:00",
      commissionWithdraw: "0%",
      parkPromotions: ["Гарантированные бонусы"],
      commission: 10,
      city: "Астана",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "ДелиМобиль",
      paymentType: "Безналичный расчет",
      supportWorkTime: "Круглосуточно",
      commissionWithdraw: "1.5% на карту",
      parkPromotions: ["Розыгрыш"],
      commission: 14,
      city: "Алматы",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "FastTaxi",
      paymentType: "Банковская карта",
      supportWorkTime: "07:00 - 23:00",
      commissionWithdraw: "0.3%",
      parkPromotions: ["Приведи друга"],
      commission: 13,
      city: "Шымкент",
    },
    {
      image:
        "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg",
      title: "GreenRide",
      paymentType: "Безналичный расчет",
      supportWorkTime: "08:00 - 20:00",
      commissionWithdraw: "0.7% на карту",
      parkPromotions: ["Бонус за активность"],
      commission: 12,
      city: "Астана",
    },
  ];

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
  const averageBill = 1200;

  const [parkPromotions, setParkPromotions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isPaymentWithCommission, setIsPaymentWithCommission] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allParkPromotions = [
    "Гарантированные бонусы",
    "Приветственные бонусы",
    "Розыгрыш",
    "Бонус за активность",
    "Приведи друга",
  ];
  const allCities = [
    { value: "Астана", label: "Астана" },
    { value: "Алматы", label: "Алматы" },
    { value: "Шымкент", label: "Шымкент" },
  ];

  const applyFilters = () => {
    const filtered = items.filter((item) => {
      const hasMatchingCity = !selectedCity || selectedCity === item.city;
      const hasMatchingPromotions =
        parkPromotions.length === 0 ||
        item.parkPromotions?.some((promotion: string) =>
          parkPromotions.includes(promotion)
        );

      // Логика фильтрации по чекбоксам "Круглосуточно" и "Ограниченное время"
      const matchesAllDay =
        supportTimeFilters.allDay && item.supportWorkTime === "Круглосуточно";
      const matchesLimited =
        supportTimeFilters.limited && item.supportWorkTime !== "Круглосуточно";
      const matchesCheckboxes =
        (!supportTimeFilters.allDay && !supportTimeFilters.limited) ||
        matchesAllDay ||
        matchesLimited;

      // Если условия не выполняются, исключаем элемент
      if (!hasMatchingPromotions || !hasMatchingCity || !matchesCheckboxes) {
        return false;
      }

      return true;
    });

    setFilteredItems(
      filtered.map((item) => {
        return {
          ...item,
          approximateIncome:
            workDays * orderPerDay * averageBill -
            ((yandexCommission + item.commission) / 100) *
              (workDays * orderPerDay * averageBill),
        };
      })
    );
  };

  const debouncedFilter = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Очистить предыдущий таймер
    }
    debounceTimeout.current = setTimeout(() => {
      applyFilters();
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
        {/* Кол-во дней в парке */}
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

        {/* Выплаты */}
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

        {/* Техподдержка */}
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

        {/* Кол-во заказов в день */}
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

        {/* Акции парка */}
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
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default Filters;
