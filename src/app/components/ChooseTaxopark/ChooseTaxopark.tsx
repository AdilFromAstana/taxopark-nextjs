"use client";

import { memo, useState } from "react";
import Carousel from "./components/Carousel";
import Filters from "./components/Filters";
import { Park } from "@/app/interfaces/interfaces";

const ChooseTaxopark: React.FC<{ parks: Park[] }> = memo(() => {
  const [filteredItems, setFilteredItems] = useState<unknown[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center mt-10 w-full lg:w-[70vw] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-4xl font-bold">
          Выберите лучший таксопарк
        </h1>
        <span className="text-base lg:text-lg text-gray-700">
          Сравните комиссии, скорость выплат и бонусы разных таксопарков
        </span>
      </div>
      <div className="hidden lg:flex w-full mb-4">
        <Filters
          setFilteredItems={setFilteredItems}
          setTotalRecords={setTotalRecords}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className="flex justify-between items-center w-full mb-6">
        <h3 className="text-lg font-semibold">
          Найдено таксопарков: {totalRecords}
        </h3>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setIsDrawerOpen(true)}
        >
          Расчитать доход
        </button>
      </div>
      <Carousel items={filteredItems} isLoading={isLoading} />
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <Filters
              setFilteredItems={setFilteredItems}
              setTotalRecords={setTotalRecords}
              setIsLoading={setIsLoading}
            />
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setIsDrawerOpen(false)}
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
ChooseTaxopark.displayName = "ChooseTaxopark";

export default ChooseTaxopark;
