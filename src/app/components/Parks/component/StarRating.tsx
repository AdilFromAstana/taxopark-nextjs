import React from "react";

interface StarRatingProps {
    label: string; // Название поля
    maxStars?: number; // Максимальное количество звёзд (по умолчанию 5)
    value: number | null; // Текущее значение рейтинга
    onChange: (value: number | null) => void; // Функция изменения значения
}

const StarRating: React.FC<StarRatingProps> = ({
    label,
    maxStars = 5,
    value = 0,
    onChange,
}) => {
    const handleSelect = (rating: number) => {
        onChange(rating); // Устанавливаем выбранное значение
    };

    const renderStar = (index: number) => {
        const isFullStar = value !== null && index + 1 <= Math.floor(value);
        const isHalfStar =
            value !== null &&
            index + 1 > Math.floor(value) &&
            index + 1 - 0.5 <= value;

        return (
            <span
                key={index}
                className="relative cursor-pointer text-2xl"
                onClick={() => handleSelect(index + 1)} // Устанавливаем рейтинг по клику
            >
                {/* Полная звезда */}
                <span
                    className={`${isFullStar ? "text-yellow-400" : "text-gray-300"
                        }`}
                >
                    ★
                </span>
                {/* Полузвезда */}
                {isHalfStar && (
                    <span
                        className="absolute left-0 top-0 text-yellow-400"
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                    >
                        ★
                    </span>
                )}
            </span>
        );
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex items-center space-x-1">
                {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
            </div>
        </div>
    );
};

export default StarRating;
