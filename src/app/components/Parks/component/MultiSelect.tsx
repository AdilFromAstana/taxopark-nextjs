import React, { useState } from "react";

interface Option {
    label: string; // Название опции (например, "Скидка 10%")
    value: number; // Значение опции (например, 1)
}

interface TagSelectProps {
    label: string; // Название поля
    options: Option[]; // Список доступных опций
    values: number[]; // Массив выбранных значений
    onChange: (values: number[]) => void; // Функция изменения массива
}

const TagSelect: React.FC<TagSelectProps> = ({
    label,
    options,
    values,
    onChange,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (value: number) => {
        if (!values.includes(value)) {
            // Добавляем значение, если его нет
            onChange([...values, value]);
        }
        setIsDropdownOpen(false);
    };

    const handleRemove = (value: number) => {
        // Удаляем значение, если оно выбрано
        onChange(values.filter((v) => v !== value));
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div
                className="flex flex-wrap items-center border border-gray-300 rounded-lg p-2 cursor-pointer gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                {values.map((value) => (
                    <div
                        key={value}
                        className="flex items-center bg-blue-500 text-white rounded-md px-3 py-1"
                    >
                        {options.find((option) => option.value === value)?.label || value}
                        <button
                            type="button"
                            className="ml-2 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(value);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <input
                    className="flex-1 border-none focus:outline-none"
                    placeholder="Выберите значения..."
                    readOnly
                />
            </div>

            {/* Выпадающий список */}
            {isDropdownOpen && (
                <div className="absolute w-full border border-gray-300 rounded-lg bg-white mt-1 max-h-40 overflow-y-auto z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`p-2 hover:bg-blue-100 cursor-pointer ${values.includes(option.value) ? "bg-blue-50" : ""
                                }`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagSelect;
