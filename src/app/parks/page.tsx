import { Viewport } from "next";
import TaxiParkTable from "../components/Parks/Parks";

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

export default async function ParksPage() {
  return <TaxiParkTable />;
}
