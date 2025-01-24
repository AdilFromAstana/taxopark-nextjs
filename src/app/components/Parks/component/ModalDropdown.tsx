import React from "react";

interface DropdownProps {
  label: string; // Название поля (отображаемое пользователю)
  value: boolean | null | undefined; // Текущее значение (true, false или null)
  onChange: (value: boolean | null | undefined) => void; // Функция изменения значения
  disabled?: boolean; // Флаг активности поля
}

const ModalDropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full border border-gray-300 rounded-lg p-2 h-10"
        style={{
          backgroundColor: disabled ? "rgba(239, 239, 239, 0.3)" : "white",
        }}
        value={typeof value === "boolean" ? value.toString() : ""} // Преобразуем boolean в строку
        disabled={disabled}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue === "") {
            onChange(null); // Если ничего не выбрано, возвращаем null
          } else {
            onChange(newValue === "true"); // Преобразуем строку обратно в boolean
          }
        }}
      >
        <option value="">Выберите...</option>
        <option value="true">Да</option>
        <option value="false">Нет</option>
      </select>
    </div>
  );
};

export default ModalDropdown;
