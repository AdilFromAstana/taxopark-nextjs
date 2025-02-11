"use client";

import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { fetchDataAPI } from "../api";
import { EntityType, Promotion } from "../interfaces/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState<EntityType>("Parks");

  const menuItems: { label: string; entityType: EntityType }[] = [
    { label: "Таксопарки", entityType: "Parks" },
    { label: "Заявки", entityType: "Forms" },
    { label: "Акции и бонусы", entityType: "Promotions" },
  ];

  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-800 text-white transition-all duration-300 w-64`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-lg font-bold block`}>Admin Panel</span>
        </div>

        <div className="mt-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`block py-2 px-4 transition-all truncate ${selectedItem === item.entityType ? "bg-gray-700 font-bold" : "hover:bg-gray-700"
                }`}
              title={item.label}
              onClick={() => setSelectedItem(item.entityType)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 bg-gray-100">
        <DataTable
          columns={[
            {
              key: "title",
              label: "Название акции",
              sortable: true,
              filterable: true,
              filterType: "text",
            },
            {
              key: ["park", "title"],
              label: "Парк",
              sortable: true,
              filterable: true,
            },
            {
              key: "createdAt",
              label: "Создано",
              sortable: true,
              filterable: true,
              filterType: "dateRange",
              render: (value) =>
                new Date(value).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            },
          ]}
          fetchData={(params) =>
            fetchDataAPI<Promotion>({
              apiEndpoint: `${API_URL}/${selectedItem}`,
              ...params,
            })
          }
          selectedItem={selectedItem}
        />
      </main>
    </div>
  );
};

export default AdminLayout;
