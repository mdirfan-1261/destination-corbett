import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172033] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Main Footer - 4 Points */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-4">

          {/* 1. Brand */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#C87532]/40 bg-white p-0.5 shadow-md">
                <img
                  src="/logo/corbett-logo.jpeg"
                  alt="Destination Corbett"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-1.5">
                  <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                    Destination
                  </span>

                  <span className="text-xl font-black tracking-tight text-[#C87532] sm:text-2xl">
                    Corbett
                  </span>
                </div>

                <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-widest">
                  Wild Safari & Luxury Stays
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65 sm:mt-5 sm:text-[15px]">
              Your complete Jim Corbett experience partner for stays, safaris,
              events and destination weddings.
            </p>
          </div>

          {/* 2. Explore */}
          <div>
            <h3 className="mb-4 text-base font-semibold sm:text-lg">
              Explore
            </h3>

            <div className="space-y-2.5 text-sm text-white/65 sm:space-y-3 sm:text-[15px]">
              <Link
                href="/"
                className="block transition-colors hover:text-[#C87532]"
              >
                Home
              </Link>

              <Link
                href="/stay"
                className="block transition-colors hover:text-[#C87532]"
              >
                Stay
              </Link>

              <Link
                href="/safari"
                className="block transition-colors hover:text-[#C87532]"
              >
                Safari
              </Link>

              <Link
                href="/packages"
                className="block transition-colors hover:text-[#C87532]"
              >
                Packages
              </Link>
            </div>
          </div>

          {/* 3. Services */}
          <div>
            <h3 className="mb-4 text-base font-semibold sm:text-lg">
              Services
            </h3>

            <div className="space-y-2.5 text-sm text-white/65 sm:space-y-3 sm:text-[15px]">
              <Link
                href="/events"
                className="block transition-colors hover:text-[#C87532]"
              >
                Events
              </Link>

              <Link
                href="/weddings"
                className="block transition-colors hover:text-[#C87532]"
              >
                Destination Weddings
              </Link>

              <Link
                href="/transport"
                className="block transition-colors hover:text-[#C87532]"
              >
                Transportation
              </Link>
            </div>
          </div>

          {/* 4. Contact */}
          <div className="col-span-2 min-w-0 sm:col-span-1">
            <h3 className="mb-4 text-base font-semibold sm:text-lg">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-white/65 sm:text-[15px]">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#C87532]"
                />

                <p className="leading-6">
                  Destination Corbett, Uttarakhand
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="shrink-0 text-[#C87532]"
                />

                <p>+91 9205299338</p>
              </div>

              {/* Email */}
              <div className="flex min-w-0 items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-[#C87532]"
                />

                <p className="break-all">
                  marketing@texora.ai
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-9 border-t border-white/10 pt-5 text-center text-xs leading-6 text-white/45 sm:mt-11 sm:pt-6 sm:text-sm">
          <p>
            © {new Date().getFullYear()} Destination Corbett. All rights
            reserved.
          </p>

          <p className="mt-1">
            • Developed by{" "}
            <a
              href="https://texora.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/65 transition-colors hover:text-[#C87532]"
            >
              Texora.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}