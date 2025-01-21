"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import car from "../../images/howItWorks/car.png";
import loop from "../../images/howItWorks/loop.png";
import doc from "../../images/howItWorks/document.png";
import check from "../../images/howItWorks/check.png";

const steps = [
  {
    number: 1,
    title: "Сравните условия парков",
    description: "Сравните комиссии, бонусы и другие условия парков.",
    url: loop,
  },
  {
    number: 2,
    title: "Выберите лучший таксопарк",
    description: "Выберите парк, который подходит вам.",
    url: check,
  },
  {
    number: 3,
    title: "Оставьте заявку",
    description: "Заполните простую заявку — это быстро.",
    url: doc,
  },
  {
    number: 4,
    title: "Начните работать",
    description: "Пройдите регистрацию и приступайте к работе!",
    url: car,
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stepImageStyle =
    "w-auto absolute opacity-50 bottom-0 hover:opacity-100 transition-all duration-1000 ease-in-out";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`py-12 text-center transform transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      ref={sectionRef}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Как это работает?
          </h2>
          <p className="text-lg text-gray-600">
            4 простых шага, чтобы начать зарабатывать!
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-[#f9f9f9] border border-gray-200 rounded-lg shadow-md p-6 w-full md:w-[calc(100%/2-80px)] lg:w-[calc(100%/2-40px)] aspect-[2.2/1] overflow-hidden"
            >
              <div className="absolute top-4 left-4 bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                {step.number}
              </div>
              <Image
                width={2560}
                height={2560}
                src={step.url}
                alt={step.title}
                className={
                  step.number === 4
                    ? `${stepImageStyle} h-full right-[-120px] scale-x-[-1]`
                    : `${stepImageStyle} h-3/4 right-0`
                }
              />
              <div className="w-1/2 flex h-full flex-col justify-center gap-[10px]">
                <h3 className="text-2xl font-semibold text-gray-700 m-0">
                  {step.title}
                </h3>
                <p className="text-gray-600 m-0 text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
