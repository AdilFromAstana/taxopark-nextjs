"use clinet";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineFrown } from "react-icons/ai";
import CarouselItem from "./CarouselItem/CarouselItem";

const getCardCount = (width = 429) => {
  if (width <= 430) {
    return 1.1;
  } else if (width > 430 && width < 768) {
    return 1.5;
  } else if (width > 768 && width < 1024) {
    return 2;
  } else {
    return 3;
  }
};

const Carousel: React.FC<{ items: unknown[] }> = ({
  items,
}: {
  items: unknown[];
}) => {
  const [carouselItems, setCarouselItems] = useState<unknown[]>([]);
  const [carouselDisabled, setCarouselDisabled] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    // Устанавливаем количество карточек только на клиенте
    const handleResize = () => {
      setSlidesToShow(getCardCount(window.innerWidth));
    };

    handleResize(); // Установить начальное значение

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", handleResize);

    return () => {
      // Удаляем слушатель при размонтировании компонента
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCarouselItems(items);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [items]);

  if (carouselItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <AiOutlineFrown className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-lg font-semibold text-gray-500">
          К сожалению, таксопарков по вашему фильтру не нашлось!
        </h2>
      </div>
    );
  } else {
    return (
      <Slider
        className="w-full"
        dots={false}
        swipe={!carouselDisabled}
        infinite={false}
        slidesToShow={slidesToShow}
        slidesToScroll={1}
        ref={sliderRef}
      >
        {carouselItems.map((item: any, index) => (
          <CarouselItem
            key={item.title}
            index={index}
            item={item}
            setCarouselDisabled={setCarouselDisabled}
            // isModalOpen={isModalOpen}
          />
        ))}
      </Slider>
    );
  }
};

export default Carousel;
