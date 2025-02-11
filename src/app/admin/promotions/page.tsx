"use client";
import { fetchDataAPI } from "@/app/api";
import DataTable from "@/app/components/DataTable";
import { Promotion } from "@/app/interfaces/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PromotionsPage() {
  return (
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
          apiEndpoint: `${API_URL}/promotions`,
          ...params,
        })
      }
    />
  );
}
