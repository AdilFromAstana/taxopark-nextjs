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
  disabled?: boolean; // Флаг активности поля
}

const TagSelect: React.FC<TagSelectProps> = ({
  label,
  options,
  values,
  onChange,
  disabled = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (value: number) => {
    if (!values.includes(value)) {
      onChange([...values, value]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemove = (value: number) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div
        className="flex flex-wrap items-center border border-gray-300 rounded-lg p-1 cursor-pointer gap-2 min-h-10"
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
      >
        {values.map((value) => (
          <div
            key={value}
            className="flex items-center bg-blue-500 text-white rounded-md px-3 py-1 text-sm"
          >
            {options.find((option) => option.value === value)?.label || value}
            {disabled ? null : (
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
            )}
          </div>
        ))}
        {!disabled && (
          <input
            className="flex-1 border-none focus:outline-none"
            placeholder="Выберите значения..."
            readOnly
            disabled={disabled}
          />
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute w-full border border-gray-300 rounded-lg bg-white mt-1 h-40 overflow-y-auto z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 hover:bg-blue-100 cursor-pointer ${
                values.includes(option.value) ? "bg-blue-50" : ""
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
