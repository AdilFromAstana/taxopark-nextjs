import { Viewport } from "next";
import TaxiParkTable from "../components/Parks/Parks";

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

async function getServerSideProps() {
  try {
    const response = await fetch("http://localhost:5000/api/cities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось загрузить данные о городах");
    }

    const cities = await response.json();
    return cities;
  } catch (error) {
    console.error("Ошибка при загрузке городов:", error);

    return {
      cities: [], // Возвращаем пустой массив, если произошла ошибка
    };
  }
}

export default async function ParksPage() {
  const data = await getServerSideProps();
  return <TaxiParkTable cities={data}/>;
}
