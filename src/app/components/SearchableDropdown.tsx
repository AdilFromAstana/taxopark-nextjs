import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchableDropdownProps {
    value: string;
    onChange: (value: string) => void;
    apiUrl: string;
    disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ value, onChange, apiUrl, disabled }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${apiUrl}?search=${searchTerm}`);
                const data = response.data;
                setOptions(data);
                setIsDropdownVisible(data.length > 0);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchTerm.length > 2 && !disabled) {
            fetchOptions();
        } else {
            setOptions([]);
            setIsDropdownVisible(false);
        }
    }, [searchTerm, apiUrl, disabled]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full border border-gray-300 rounded-lg p-2 pl-8 pr-8 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    placeholder="Выберите значение"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => !disabled && setIsDropdownVisible(true)}
                    disabled={disabled}
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
                {searchTerm && !disabled && (
                    <FaTimes
                        className="absolute right-2 top-3 text-gray-400 cursor-pointer"
                        onClick={() => {
                            setSearchTerm("");
                            onChange("");
                            setOptions([]);
                            setIsDropdownVisible(false);
                        }}
                    />
                )}
            </div>
            {isDropdownVisible && (
                <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto border border-gray-200">
                    {isLoading ? (
                        <div className="p-2 text-gray-500">Загрузка...</div>
                    ) : options.length > 0 ? (
                        options.slice(0, 10).map((option) => (
                            <div
                                key={option.id}
                                className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                                onClick={() => {
                                    onChange(option.id);
                                    setSearchTerm(option.title);
                                    setIsDropdownVisible(false);
                                }}
                            >
                                {option.title}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">Таксопарки не найдены</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
