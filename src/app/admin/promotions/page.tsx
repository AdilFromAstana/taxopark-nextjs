import PromotionsTable from "@/app/components/PromotionsTable/PromotionsTable";
import { Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    userScalable: false,
};

async function getParks() {
    try {
        const response = await fetch("http://188.94.156.86/api/parks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Не удалось загрузить данные о городах");
        }

        const data = await response.json();
        return data.parks;
    } catch (error) {
        console.error("Ошибка при загрузке городов:", error);
        return []
    }
}

export default async function PromotionsPage() {
    const data = await getParks();
    return <PromotionsTable parks={data} />;
}
