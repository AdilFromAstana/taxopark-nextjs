import { Viewport } from "next";
import FormTable from "../components/Forms/Forms";

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

export default async function FormsPage() {
  return <FormTable />;
}
