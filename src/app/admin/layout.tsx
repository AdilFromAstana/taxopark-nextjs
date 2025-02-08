"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Таксопарки",
      link: "/admin/parks",
    },
    {
      label: "Заявки",
      link: "/admin/forms",
    },
    {
      label: "Акции и бонусы",
      link: "/admin/promotions",
    },
  ];

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-lg font-bold  block`}>Admin Panel</span>
        </div>

        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={pathname === item.link ? "#" : item.link}
              passHref
              className={`block py-2 px-4 transition-all truncate ${pathname === item.link
                ? "bg-gray-700 font-bold"
                : "hover:bg-gray-700"
                }`}
              title={item.label}
              onClick={(e) => {
                if (pathname === item.link) {
                  e.preventDefault(); // Предотвращаем переход, если это текущий маршрут
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
};

export default AdminLayout;
