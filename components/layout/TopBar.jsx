export default function TopBar() {
    return (
        <div className="hidden md:block bg-[#172033] text-white text-sm py-2">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                <p>
                    🌿 Your Complete Jim Corbett Experience
                </p>

                <div className="flex gap-5">
                    <a
                        href="tel:+919205299338"
                        className="hover:text-gray-300 transition"
                    >
                        📞 +91 9205299338
                    </a>

                    <a
                        href="mailto:marketing@texora.ai"
                        className="hover:text-gray-300 transition"
                    >
                        ✉️ marketing@texora.ai
                    </a>
                </div>
                <span className="italic">
                    Independent travel facilitator — not the official Forest Dept. portal
                </span>
            </div>
        </div>
    );
}