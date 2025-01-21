"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const reviews = [
  {
    id: 4,
    name: "Сергей П.",
    text: "Быстро и качественно. Спасибо за работу!",
  },
  {
    id: 1,
    name: "Иван И.",
    text: "Отличный сервис! Очень доволен качеством.",
  },
  {
    id: 2,
    name: "Анна К.",
    text: "Рекомендую всем, кто ищет надежность и профессионализм.",
  },
  {
    id: 3,
    name: "Сергей П.",
    text: "Быстро и качественно. Спасибо за работу!",
  },
];

const Reviews = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Отслеживаем только первый раз
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
      className={`py-8 text-center transform transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      ref={sectionRef}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Отзывы</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center flex flex-col items-center"
            >
              <Image
                width={100}
                height={100}
                src={
                  "https://www.eg.ru/wp-content/uploads/2024/07/tyuremnye-sroki-lyubov-so-zvezdoy-doma-2-i-jizn-v-rossii-chto-stalo-so-zvezdoy-taksi-sami-naseri.jpg"
                }
                alt={review.name}
                className="rounded-full mb-4 h-full"
              />
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {review.name}
              </h3>
              <p className="text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
