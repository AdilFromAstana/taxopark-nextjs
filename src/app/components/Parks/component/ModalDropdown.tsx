import React from "react";

interface DropdownProps {
  label: string;
  value?: boolean | null | undefined;
  onChange: (value: boolean | null | undefined) => void;
  disabled?: boolean;
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
        value={
          value !== undefined && value !== null ? value.toString() : undefined
        }
        disabled={disabled}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue === "") {
            onChange(null);
          } else {
            onChange(newValue === "true");
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
