import { Viewport } from "next";
import TaxiFormTable from "../components/Forms/Forms";
import { Park } from "../interfaces/interfaces";

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

export default async function FormsPage() {
  const data = await fetchForms(); // Загрузка данных
  return <TaxiFormTable data={data} />;
}
