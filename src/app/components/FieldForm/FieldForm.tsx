"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SupportModal from "./SupportModal/SupportModal";

const FieldForm = () => {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full bg-yellow-400 py-12">
      <div className="container mx-auto px-6 flex justify-between gap-10 flex-col md:flex-row">
        <div className="flex-1 max-w-lg flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Выбирай лучший ТаксоПарк!
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Сравнивайте и выбирайте лучшие условия для работы!
          </p>
        </div>

        <div className="flex-1 bg-white max-w-lg rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Бесплатная консультация!
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
              setStep(2);
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ФИО
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Введите ФИО"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Телефон
              </label>
              <PhoneInput
                country="kz"
                onlyCountries={["kz"]}
                value={phone}
                onChange={(value) => setPhone(value)}
                placeholder="+7-777-77-77-77"
                disableDropdown={true}
                inputClass="!w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                masks={{ kz: "(...) ...-..-.." }}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>

      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phone={phone}
        setStep={setStep}
        step={step}
      />
    </div>
  );
};

export default FieldForm;
