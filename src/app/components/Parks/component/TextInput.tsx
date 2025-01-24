interface TextInputProps {
  label: string; // Название поля
  value: string | number; // Значение поля
  onChange: (value: string) => void; // Функция изменения значения
  placeholder?: string; // Плейсхолдер
  disabled?: boolean; // Флаг активности поля
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      className="w-full border border-gray-300 rounded-lg p-2 h-10"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

export default TextInput;
