"use client";
import { useState } from "react";

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="flex items-center justify-between flex-wrap">
        {/* Логотип */}
        <div className="flex-1 text-left">
          {/* <img src="/logo.png" alt="logo" className="w-36 h-auto" /> */}
        </div>

        {/* Контакты */}
        <div className="hidden md:block flex-1 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-sm">+7-776-777-77-77</span>
            <span className="text-sm">Круглосуточно</span>
          </div>
        </div>

        {/* Навигация */}
        <nav className="hidden md:flex flex-3 justify-around">
          <a href="#" className="text-white text-sm font-bold hover:underline">
            Главная
          </a>
          <a href="#" className="text-white text-sm font-bold hover:underline">
            Как это работает?
          </a>
          <a href="#" className="text-white text-sm font-bold hover:underline">
            Акции и бонусы
          </a>
          <a href="#" className="text-white text-sm font-bold hover:underline">
            Контакты
          </a>
        </nav>

        {/* Кнопка регистрации */}
        <div className="hidden md:block flex-1 text-right">
          <button className="bg-white text-blue-500 font-bold py-2 px-4 rounded-full hover:bg-gray-200">
            Зарегистрироваться
          </button>
        </div>

        {/* Кнопка меню для мобильных */}
        <div className="block md:hidden">
          <button onClick={() => setIsDrawerOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM3 19a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col p-4">
          <button
            className="self-end text-white text-2xl"
            onClick={() => setIsDrawerOpen(false)}
          >
            ✕
          </button>
          <nav className="flex flex-col items-center mt-8 gap-4">
            <a
              href="#"
              className="text-white text-lg font-bold hover:underline"
            >
              Главная
            </a>
            <a
              href="#"
              className="text-white text-lg font-bold hover:underline"
            >
              Как это работает?
            </a>
            <a
              href="#"
              className="text-white text-lg font-bold hover:underline"
            >
              Акции и бонусы
            </a>
            <a
              href="#"
              className="text-white text-lg font-bold hover:underline"
            >
              Контакты
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
