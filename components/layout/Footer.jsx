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


        {/* Social Media */}
        <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/texora-ai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Texora AI on LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: "#0A66C2" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.25 6.94 1.97 1.97 0 0 0 5.25 3ZM20.44 13.41c0-3.46-1.84-5.07-4.3-5.07-1.98 0-2.87 1.09-3.36 1.86V8.5H9.4V20h3.38v-6.4c0-1.69.32-3.33 2.42-3.33 2.07 0 2.1 1.94 2.1 3.44V20h3.38l-.24-6.59Z"
              />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@Texoraai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Texora AI on YouTube"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: "#FF0000" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#fff"
              aria-hidden="true"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/destination_corbett?stkn=NzIxMG1ndmd5Zg%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Destination Corbett on Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 75%, #515BD4 100%)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/texoraaiCX/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Texora AI on Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: "#1877F2" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#fff"
              aria-hidden="true"
            >
              <path d="M14 8h3V4h-3c-3.314 0-5 1.686-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.552.448-1 1-1z" />
            </svg>
          </a>
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