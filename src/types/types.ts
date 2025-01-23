export interface Park {
  image: string;
  title: string;
  paymentType: string;
  supportWorkTime: string;
  commissionWithdraw: string;
  parkPromotions: string[];
  commission: number;
  city: string;
  approximateIncome: number;
  transferPayments: string;
  hasParkIP: string;
  ipRegistrationSupport: string;
  accountingSupport: string;
  yandexFuel: string;
  carRentals: string;
  instantPayments: string;
}

export interface CarouselItemProps {
  item: Park; // Объект парка
  setCarouselDisabled: React.Dispatch<React.SetStateAction<boolean>>; // Функция изменения состояния
}
