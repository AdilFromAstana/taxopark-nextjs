"use server";
import ChooseTaxopark from "./components/ChooseTaxopark/ChooseTaxopark";
import Advantages from "./components/Advantages/Advantages";
import FieldForm from "./components/FieldForm/FieldForm";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Reviews from "./components/Reviews/Reviews";
import Header from "./components/Header/Header";

export default async function Home() {
  return (
    <>
      <Header />
      <ChooseTaxopark />
      <Reviews />
      <HowItWorks />
      <Advantages />
      <FieldForm />
    </>
  );
}
