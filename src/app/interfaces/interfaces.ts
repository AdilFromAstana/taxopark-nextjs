export interface Park {
  id: string;
  parkEntrepreneurSupport?: boolean | null;
  entrepreneurSupport?: boolean | null;
  commissionWithdraw?: number | null;
  transferPaymentCommission?: number | null;
  accountantSupport?: boolean | null;
  yandexGasStation?: boolean | null;
  supportWorkTime?: string | null;
  parkCommission: number;
  averageCheck: number;
  parkPromotions?: number[] | null;
  paymentType?: number | null;
  active: boolean;
  rating?: number | null;
  cityId: string;
  title: string;
  City: {
    id: string;
    title: string;
  };
  createdAt: string; // Дата создания записи
  updatedAt: string; // Дата последнего обновления записи
}

export interface ParkInCarousel extends Park {
  approximateIncome: number;
}

export interface Promotion {
  id: number;
  title: string;
  taxiPark: string;
  description: string;
  startDate: string;
  expires: string | null;
  active: boolean;
  park: {
    title: string;
    id: string;
  };
  createdAt: string;
}

export interface Form {
  id: string; // Уникальный идентификатор формы
  name: string; // Имя и фамилия отправителя формы
  parkId?: string; // Идентификатор таксопарка (может быть отсутствовать)
  formType: "taxiPark" | "consultation"; // Тип формы
  phoneNumber: string; // Номер телефона отправителя
  createdAt: string; // Дата создания записи
  updatedAt: string; // Дата последнего обновления записи
  Park?: Park; // Связанный таксопарк, если форма связана с таксопарком
}

export interface City {
  id: string; // Уникальный идентификатор города
  title: string; // Название города
}

export interface ApiError {
  message: string; // Основное сообщение об ошибке
  status?: number; // HTTP-статус код (если доступен)
  details?: string[]; // Дополнительные детали об ошибке
}

export interface GetParks {
  data: Park[];
  total: number;
  page: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc" | null;

export type EntityType = "Promotion" | "Park" | "Form";

export interface Field<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any) => string;
}

export interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

export interface FormTableProps {
  cities: any[];
}

export interface GetForms {
  data: Form[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetFormsParams {
  filteredParks?: string[];
  filterName?: string;
  filterEndDate?: string;
  filterStartDate?: string;
}

export interface SaveExcelButtonProps {
  url: string;
  dataType: "parks" | "forms";
}
