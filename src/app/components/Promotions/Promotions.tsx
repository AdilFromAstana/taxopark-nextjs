'use client';

import { useState } from 'react';

interface Promotion {
    id: number;
    title: string;
    company: string;
    description: string;
    image: string;
    startDate: string;
    expires: string | null;
    active: boolean;
}

const promotions: Promotion[] = [
    {
        id: 1,
        title: 'Розыгрыш iPhone 15',
        company: 'Boom Taxi',
        description: 'Выполните 30 заказов за неделю и участвуйте в розыгрыше нового iPhone 15!',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '1 февраля 2025',
        expires: '31 марта 2025',
        active: true,
    },
    {
        id: 2,
        title: 'Скидка 50% на первый заказ',
        company: 'FastCab',
        description: 'Сделайте первый заказ и получите скидку 50%!',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '10 января 2025',
        expires: null,
        active: true,
    },
    {
        id: 3,
        title: 'Бонус за каждые 10 поездок',
        company: 'SpeedyTaxi',
        description: 'Совершите 10 поездок и получите 2000 тг бонусов на счёт!',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '5 февраля 2025',
        expires: '15 февраля 2025',
        active: true,
    },
    {
        id: 4,
        title: 'Кэшбэк 10% на все поездки',
        company: 'EcoRide',
        description: 'Получайте 10% кэшбэка на все поездки по городу!',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '1 января 2025',
        expires: '10 февраля 2025',
        active: false,
    },
    {
        id: 5,
        title: 'Промокод на бесплатную поездку',
        company: 'SuperCab',
        description: 'Используйте промокод FREECAB и получите одну бесплатную поездку.',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '15 января 2025',
        expires: '1 февраля 2025',
        active: false,
    },
    {
        id: 6,
        title: 'Счастливые часы: скидка 30%',
        company: 'QuickGo',
        description: 'С 18:00 до 20:00 получайте скидку 30% на все поездки!',
        image: 'https://i.imgur.com/EaFeqfz.jpg',
        startDate: '5 января 2025',
        expires: '20 января 2025',
        active: false,
    },
];

export default function Promotions() {
    const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const filteredPromotions = promotions
        .filter((promo) =>
            promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promo.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((promo) => (showActiveOnly ? promo.active && (!promo.expires || new Date(promo.expires) > new Date()) : true))
        .sort((a, b) => (b.expires ? new Date(b.expires).getTime() : Infinity) - (a.expires ? new Date(a.expires).getTime() : Infinity));


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Акции и бонусы от таксопарков</h1>
            <p className="text-gray-600 mb-6">Следите за актуальными предложениями, участвуйте в розыгрышах, получайте бонусы и скидки!</p>

            <input
                type="text"
                placeholder="Поиск по акциям..."
                className="w-full p-2 border rounded mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <label className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" checked={showActiveOnly} onChange={() => setShowActiveOnly(!showActiveOnly)} />
                Показывать только активные акции
            </label>

            <div className="grid gap-4">
                {filteredPromotions.map((promo) => (
                    <div
                        key={promo.id}
                        className={`cursor-pointer bg-white p-4 rounded-lg shadow-md ${!promo.active || (promo.expires && new Date(promo.expires) < new Date()) ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedPromo(promo)}
                    >
                        <img src={promo.image} alt={promo.title} className="w-full h-40 object-cover rounded-md" />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">{promo.title}</h2>
                            <p className="text-sm text-gray-700">{promo.company}</p>
                            <p className="text-gray-600 text-sm mt-1">{promo.description}</p>
                            <p className="text-xs text-blue-500 mt-1">Начало: {promo.startDate}</p>
                            {promo.expires && <p className="text-xs text-red-500 mt-1">Действует до {promo.expires}</p>}
                            <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md">Подробнее</button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedPromo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-bold mb-2">{selectedPromo.title}</h2>
                        <p className="text-gray-700 mb-2">Таксопарк: {selectedPromo.company}</p>
                        <p className="text-gray-600 mb-4">{selectedPromo.description}</p>
                        {selectedPromo.expires && <p className="text-red-500 text-sm">Действует до {selectedPromo.expires}</p>}
                        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md" onClick={() => alert('Заявка отправлена')}>Оставить заявку</button>
                        <button className="mt-2 w-full bg-gray-300 py-2 rounded-md" onClick={() => setSelectedPromo(null)}>Закрыть</button>
                    </div>
                </div>
            )}

        </div>
    );
}
