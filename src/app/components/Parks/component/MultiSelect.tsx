import React, { useState } from "react";

interface Option<T> {
  label: string;
  value: T;
}

interface MultiSelectProps<T> {
  label?: string;
  options: Option<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  disabled?: boolean;
}

const MultiSelect = <T,>({
  label,
  options,
  values,
  onChange,
  disabled = false,
}: MultiSelectProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (value: T) => {
    if (!values.includes(value)) {
      onChange([...values, value]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemove = (value: T) => {
    onChange(values.filter((v) => v !== value));
  };

  const renderSelectedItems = () => {
    if (!Array.isArray(values)) {
      console.error("values is not an array:", values);
      return null;
    }

    if (values.length <= 2) {
      return values.map((value) => (
        <div
          key={String(value)}
          className="flex items-center bg-blue-500 text-white rounded-md px-3 py-1 text-sm"
        >
          {String(options.find((option) => option.value === value)?.label || value)}
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
      ));
    } else {
      const visibleValues = values.slice(0, 2);
      const remainingCount = values.length - 2; // исправлено с `values.length - 1`

      return (
        <>
          {visibleValues.map((value) => (
            <div
              key={String(value)}
              className="flex items-center bg-blue-500 text-white rounded-md px-3 py-1 text-sm"
            >
              {String(options.find((option) => option.value === value)?.label || value)}
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
          <div className="flex items-center bg-gray-300 text-black rounded-md px-3 py-1 text-sm">
            +{remainingCount}
          </div>
        </>
      );
    }
  };


  return (
    <div className="relative w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div
        className="flex flex-wrap items-center border border-gray-300 rounded-lg p-1 cursor-pointer gap-2 min-h-10"
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
      >
        {renderSelectedItems()}
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
              key={String(option.value)}
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

export default MultiSelect;
