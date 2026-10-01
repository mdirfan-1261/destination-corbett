import { Phone, Mail, MessageCircle, Leaf } from "lucide-react";

const PHONE = "+919205299338";
const PHONE_LABEL = "+91 92052 99338";
const EMAIL = "marketing@texora.ai";
const WA_TEXT = encodeURIComponent("Hi Destination Corbett, I would like to know more about your services.");

const link =
    "group flex items-center gap-2 text-[11px] font-medium tracking-wide text-white/75 transition-colors hover:text-[#E1A05B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E1A05B]";

export default function TopBar() {
    return (
        <div className="relative hidden bg-[#172033] text-white md:block">
            <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6">
                {/* Left */}
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    <Leaf size={13} className="text-[#E1A05B]" aria-hidden="true" />
                    Your Complete Jim Corbett Experience
                </p>

                {/* Right */}
                <div className="flex items-center">
                    <a href={`tel:${PHONE}`} className={link}>
                        <Phone size={13} className="text-[#E1A05B]" aria-hidden="true" />
                        {PHONE_LABEL}
                    </a>

                    <span className="mx-4 h-3.5 w-px bg-white/15" aria-hidden="true" />

                    <a href={`mailto:${EMAIL}`} className={link}>
                        <Mail size={13} className="text-[#E1A05B]" aria-hidden="true" />
                        {EMAIL}
                    </a>

                    <span className="mx-4 h-3.5 w-px bg-white/15" aria-hidden="true" />

                    <a
                        href={`https://wa.me/${PHONE.replace("+", "")}?text=${WA_TEXT}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <MessageCircle size={12} aria-hidden="true" />
                        WhatsApp
                    </a>

                    <span className="ml-4 border-l border-white/15 pl-4 text-[10px] italic text-white/45">
                        Independent travel facilitator
                    </span>
                </div>
            </div>

            {/* Gold hairline */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E1A05B]/60 to-transparent" />
        </div>
    );
}