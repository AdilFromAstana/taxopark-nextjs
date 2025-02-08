"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Loading() {
    const pathname = usePathname();

    if (pathname.includes("admin")) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <Image width={1000} height={1000} src="https://i0.wp.com/ugokawaii.com/wp-content/uploads/2023/05/taxi.gif?ssl=1" alt="loading" />
        </div>
    </div>
}