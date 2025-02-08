"use server";
import ChooseTaxopark from "./components/ChooseTaxopark/ChooseTaxopark";
import Advantages from "./components/Advantages/Advantages";
import FieldForm from "./components/FieldForm/FieldForm";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Reviews from "./components/Reviews/Reviews";

export default async function Home() {
  return (
    <>
      <ChooseTaxopark />
      <Reviews />
      <HowItWorks />
      <Advantages />
      <FieldForm />
    </>
  );
}
