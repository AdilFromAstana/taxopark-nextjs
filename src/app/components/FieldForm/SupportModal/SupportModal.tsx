"use client";

import React, { useEffect, useState } from "react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  setStep: (step: number) => void;
  step: number;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  phone,
  setStep,
  step,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60); // Таймер для повторной отправки OTP
  const otp = "1234"; // Замоканный OTP
  const [inputOtp, setInputOtp] = useState("");

  const sendOtp = () => {
    if (!phone || phone.length < 11) {
      alert("Введите корректный номер телефона.");
      return;
    }
    setOtpSent(true);
    setTimer(60); // Сброс таймера
    alert("OTP отправлен!");
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setOtpSent(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpVerification = () => {
    if (inputOtp === otp) {
      alert("Заявка успешно отправлена!");
      setStep(3); // Переход на шаг 3
    } else {
      alert("Неправильный OTP-код. Попробуйте снова.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Отключаем прокрутку при открытом модальном окне
    } else {
      document.body.style.overflow = ""; // Включаем прокрутку
    }
    return () => {
      document.body.style.overflow = ""; // Сбрасываем стиль при размонтировании
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        {/* Заголовок */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-center mb-4">
              Код подтверждения
            </h2>
            <p className="mb-4">Введите код из SMS для подтверждения заявки:</p>
            <input
              type="text"
              maxLength={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Введите OTP"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
              onClick={handleOtpVerification}
            >
              Подтвердить
            </button>

            <div className="mt-4 text-center">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setStep(1);
                  setInputOtp("");
                  onClose();
                }}
              >
                Сменить номер
              </button>
              {otpSent ? (
                <p className="text-sm text-gray-600 mt-2">
                  Повторная отправка SMS будет доступна через {timer} секунд
                </p>
              ) : (
                <button
                  className="text-blue-500 hover:underline mt-2"
                  onClick={sendOtp}
                >
                  Отправить OTP снова
                </button>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Успешно отправлено!</h2>
            <p className="text-gray-600">
              Ожидайте звонка в ближайшее время. Спасибо за вашу заявку.
            </p>
            <button
              className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={() => {
                setStep(1);
                setInputOtp("");
                onClose();
              }}
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Кнопка закрытия */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ApplicationModal;
