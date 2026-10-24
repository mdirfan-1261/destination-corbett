
"use client";

import { useParams } from "next/navigation";
import SafariPage from "../page";

const ALLOWED_CATEGORIES = [
    "jeep",
    "canter",
    "elephant",
    "other",
];

export default function SafariCategoryPage() {
    const params = useParams();
    const category = String(params?.category || "").toLowerCase();

    if (!ALLOWED_CATEGORIES.includes(category)) {
        return (
            <main className="flex min-h-[50vh] flex-col items-center justify-center bg-[#F7F5F0] px-4 py-16 text-center text-[#172033]">
                <h1 className="text-2xl font-bold">
                    Safari category not found
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Please select a valid safari category.
                </p>

                <a
                    href="/safari"
                    className="mt-5 inline-flex rounded-full bg-[#B96928] px-5 py-3 font-semibold text-white"
                >
                    View All Safaris
                </a>
            </main>
        );
    }

    return <SafariPage />;
}
