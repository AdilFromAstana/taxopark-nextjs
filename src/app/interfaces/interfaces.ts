export interface Park {
  id: string;
  parkEntrepreneurSupport?: boolean | null;
  entrepreneurSupport?: boolean | null;
  commissionWithdraw?: number | null;
  transferPaymentCommission?: number | null;
  accountantSupport?: boolean | null;
  yandexGasStation?: boolean | null;
  supportWorkTime?: string | null;
  parkCommission?: number | null;
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
