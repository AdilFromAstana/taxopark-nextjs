"use client";

import React, { useState } from "react";
import { FaCheck, FaGasPump, FaLocationDot } from "react-icons/fa6";
import { GoCreditCard } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { LuClock3, LuGift } from "react-icons/lu";
import { MdHeadsetMic, MdPercent } from "react-icons/md";
import { TfiClose } from "react-icons/tfi";
import ApplicationModal from "../ApplicationModal";
import Image from "next/image";

function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const CarouselItem: React.FC<{
  item: any;
  index: number;
  setCarouselDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ item, setCarouselDisabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const openModal = (event: any) => {
    event.stopPropagation();
    setCarouselDisabled(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCarouselDisabled(false);
    setIsModalOpen(false);
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="relative h-[650px]">
      <div
        className="relative w-full h-full transform transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          transform: flipped ? "rotateY(180deg)" : "",
        }}
      >
        <div
          className="z-[1] absolute w-full h-full bg-white rounded-lg shadow-md flex flex-col items-center p-6 cursor-pointer"
          style={{
            backfaceVisibility: "hidden",
          }}
          onClick={toggleFlip}
        >
          <Image
            className="w-full h-44 object-cover rounded-t-lg"
            height={2000}
            width={2000}
            src={
              "https://www.shbarcelona.ru/blog/ru/wp-content/uploads/2020/01/oli-woodman-fwYZ3B_QQco-unsplash.jpg"
            }
            alt={item.title}
          />
          <div className="flex flex-col items-start gap-2 p-4 flex-grow">
            <div className="text-center font-bold text-xl">
              {formatNumber(item.approximateIncome)} ₸
            </div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <div className="flex items-center gap-1 text-yellow-400">
              <IoIosStar className="text-xl" />
              <span>4.8</span>
            </div>
            <div className="flex items-center gap-2">
              <MdPercent className="text-xl" />
              <span>Комиссия {item.commission}%</span>
            </div>
            <div className="flex items-center gap-2">
              <LuClock3 className="text-xl" />
              <span>Моментальные выплаты</span>
            </div>
            <div className="flex items-center gap-2">
              <MdHeadsetMic className="text-xl" />
              <span>{item.supportWorkTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationDot className="text-xl" />
              <span>{item.city}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-4">
              <LuGift className="text-xl" />
              {item.parkPromotions.map((bonus: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-yellow-200 px-2 py-1 rounded-md text-sm"
                >
                  {bonus}
                </span>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={openModal}
            >
              Оставить заявку
            </button>
          </div>
        </div>

        <div
          className="z-[2] absolute w-full h-full bg-white rounded-lg shadow-md flex flex-col items-start p-6 cursor-pointer rotate-y-180"
          onClick={toggleFlip}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h3 className="font-semibold text-lg mb-4">{item.title}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MdPercent className="text-xl" />
              <span>Комиссия парка:</span> {item.commission}%
            </div>
            <div className="flex items-center gap-2">
              <GoCreditCard className="text-xl" />
              <span>Моментальные выплаты:</span>{" "}
              {item.instantPayments ? (
                `Да (${item.instantPaymentCommission}%)`
              ) : (
                <TfiClose className="text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <MdHeadsetMic className="text-xl" />
              <span>Техподдержка:</span>{" "}
              {item.supportWorkTime === "Круглосуточно"
                ? "Круглосуточно"
                : "Ограниченно"}
            </div>
            <div className="flex items-center gap-2">
              <FaGasPump className="text-xl" />
              <span>Яндекс Заправка:</span>{" "}
              {item.yandexFuel ? (
                <FaCheck className="text-green-500" />
              ) : (
                <TfiClose className="text-red-500" />
              )}
            </div>
          </div>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={openModal}
          >
            Оставить заявку
          </button>
        </div>
      </div>
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CarouselItem;
