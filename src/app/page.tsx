"use server";
import ChooseTaxopark from "./components/ChooseTaxopark/ChooseTaxopark";
import Advantages from "./components/Advantages/Advantages";
import FieldForm from "./components/FieldForm/FieldForm";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Reviews from "./components/Reviews/Reviews";
import Header from "./components/Header/Header";
import { Park } from "./interfaces/interfaces";

async function fetchParks(): Promise<Park[]> {
  const response = await fetch("http://localhost:5000/api/parks", {
    cache: "no-store", // Указывает, что данные не должны кэшироваться
  });

  if (!response.ok) {
    throw new Error("Ошибка при загрузке данных таксопарков");
  }

  const data: Park[] = await response.json();
  return data;
}

export default async function Home() {
  const parks = await fetchParks(); // Загрузка данных
  return (
    <>
      <Header />
      <ChooseTaxopark parks={parks} />
      <Reviews />
      <HowItWorks />
      <Advantages />
      <FieldForm />
    </>
  );
}
