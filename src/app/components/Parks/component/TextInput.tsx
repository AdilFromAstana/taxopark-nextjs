interface TextInputProps {
    label: string; // Название поля
    value: string | number; // Значение поля
    onChange: (value: string) => void; // Функция изменения значения
    placeholder?: string; // Плейсхолдер
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder = "",
}) => (
    <div className="w-full">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

export default TextInput;
