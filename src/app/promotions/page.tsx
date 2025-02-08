import { Viewport } from "next";
import Promotions from "../components/Promotions/Promotions";

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

export default async function PromotionsPage() {
  return <Promotions />;
}
