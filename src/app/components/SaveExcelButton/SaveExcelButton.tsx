import { formatPhoneNumber } from "@/app/common/common";
import { Form, Park, SaveExcelButtonProps } from "@/app/interfaces/interfaces";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { memo, useState } from "react";
import { IoMdDownload } from "react-icons/io";

const normalizeData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(normalizeData); // Обработка массивов
  }
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null || value === undefined || value === ""
          ? "-" // Заменяем null, undefined и пустые строки на "-"
          : typeof value === "boolean"
          ? value
            ? "Да" // true -> "Да"
            : "Нет" // false -> "Нет"
          : normalizeData(value),
      ])
    );
  }
  return typeof data === "boolean"
    ? data
      ? "Да" // true -> "Да"
      : "Нет" // false -> "Нет"
    : data; // Если это примитивное значение, просто возвращаем его
};

const formTypeObj = {
  taxiPark: "Таксопарку",
  consultation: "Консультация",
};

const excelHeaders = {
  forms: [
    { header: "ФИО", key: "name", width: 50 },
    { header: "Номер телефона", key: "phoneNumber", width: 50 },
    { header: "Парк", key: "park", width: 50 },
    { header: "Тип заявки", key: "formType", width: 50 },
    { header: "Дата заявления", key: "createdAt", width: 50 },
  ],
  parks: [
    {
      header: "ИП парка",
      key: "parkEntrepreneurSupport",
      width: 50,
    },
    {
      header: "Поддержка ИП",
      key: "entrepreneurSupport",
      width: 50,
    },
    {
      header: "Комиссия за перевод",
      key: "transferPaymentCommission",
      width: 50,
    },
    { header: "Бухгалтерская поддержка", key: "accountantSupport", width: 50 },
    { header: "Заправки Yandex", key: "yandexGasStation", width: 50 },
    { header: "Время работы поддержки", key: "supportWorkTime", width: 50 },
    { header: "Комиссия парка", key: "parkCommission", width: 50 },
    { header: "Акции парка", key: "parkPromotions", width: 50 },
    { header: "Тип оплаты", key: "paymentType", width: 50 },
    { header: "Рейтинг", key: "rating", width: 50 },
    { header: "Название", key: "title", width: 50 },
    { header: "Средний чек", key: "averageCheck", width: 50 },
    { header: "Город", key: "city", width: 50 },
    { header: "Создано", key: "createdAt", width: 50 },
  ],
};

const SaveExcelButton: React.FC<SaveExcelButtonProps> = memo(
  ({ url, dataType }) => {
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (): Promise<Form[] | Park[]> => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        if (dataType === "forms") {
          return result.forms.map((form: Form) =>
            normalizeData({
              ...form,
              phoneNumber: formatPhoneNumber(form.phoneNumber),
              park: form?.Park ? form?.Park.title : "-",
              formType: formTypeObj[form.formType],
              createdAt: new Date(form.createdAt).toLocaleString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            })
          );
        } else if (dataType === "parks") {
          return result.parks.map((park: Park) => {
            return normalizeData({
              ...park,
              city: park.City.title,
              createdAt: new Date(park.createdAt).toLocaleString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            });
          });
        }

        throw new Error("Unknown data type");
      } catch (error) {
        console.error("Ошибка при загрузке данных: ", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    const exportToExcel = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = excelHeaders[dataType];
        worksheet.addRows(data);

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "data.xlsx");
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        className="p-2 border-2 rounded-lg flex gap-2 bg-gray-800 text-white"
        onClick={exportToExcel}
      >
        Скачать Excel
        {isLoading ? (
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-r-4 border-gray-300 border-t-gray-500 border-r-gray-500 h-6 w-6 animate-spin"></div>
        ) : (
          <IoMdDownload fontSize="24px" />
        )}
      </button>
    );
  }
);

SaveExcelButton.displayName = "SaveExcelButton";

export default SaveExcelButton;
