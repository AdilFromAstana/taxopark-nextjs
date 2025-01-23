export interface Park {
  id: string; // Уникальный идентификатор таксопарка
  parkEntrepreneurSupport?: boolean | null; // Поддержка паркового ИП (в процентах или числовое значение)
  entrepreneurSupport?: boolean | null; // Поддержка ИП водителей
  commissionWithdraw?: number | null; // Комиссия за снятие средств
  paymentsByTransfer?: number | null; // Выплаты переводом
  accountantSupport?: boolean | null; // Уровень поддержки бухгалтерии
  yandexGasStation?: boolean | null; // Наличие поддержки Яндекс заправки
  supportWorkTime?: string | null; // Время работы техподдержки
  parkCommission?: number | null; // Комиссия парка в процентах
  parkPromotions?: number[] | null; // Акции парка (массив чисел)
  paymentType?: number | null; // Тип оплаты (например, 0 = наличные, 1 = карта)
  active?: boolean | null; // Статус активности парка
  rating?: number | null; // Рейтинг таксопарка (может быть с дробной частью)
  cityId: string; // Идентификатор города
  title: string; // Название таксопарка
  City: {
    id: string; // Идентификатор города
    title: string; // Название города
  }; // Идентификатор города
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
