"use client";

import { useEffect, useState } from "react";
import { City, EntityType, GetParks, Park, Promotion } from "../interfaces/interfaces";
import { NotificationProvider } from "../context/NotificationContext";
import TaxiParkTable from "../components/Parks/Parks";
import FormTable from "../components/Forms/Forms";
import Promotions from "../components/Promotions/Promotions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AdminLayout = () => {
  const menuItems: { label: string; entityType: EntityType }[] = [
    { label: "Таксопарки", entityType: "Parks" },
    { label: "Заявки", entityType: "Forms" },
    { label: "Акции и бонусы", entityType: "Promotions" },
  ];
  const [selectedItem, setSelectedItem] = useState<{ label: string; entityType: EntityType }>(menuItems[0]);
  const [cities, setCities] = useState<City[]>([]);
  const [parks, setParks] = useState<Park[]>([]);

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

  useEffect(() => {
    getParks()
    getCities()
  }, [])

  return (
    <NotificationProvider>
      <div className="flex h-screen">
        <aside className={`bg-gray-800 text-white transition-all duration-300 w-64`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <span className={`text-lg font-bold block`}>Admin Panel</span>
          </div>

          <div className="mt-4">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`block py-2 px-4 transition-all truncate ${selectedItem.entityType === item.entityType ? "bg-gray-700 font-bold" : "hover:bg-gray-700"
                  }`}
                title={item.label}
                onClick={() => setSelectedItem(item)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-gray-100">
          {
            selectedItem.entityType === "Parks" ?
              <TaxiParkTable cities={cities} />
              : selectedItem.entityType === "Forms" ?
                <FormTable />
                : selectedItem.entityType === "Promotions" ?
                  <Promotions /> : null
          }
        </main>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;
