import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172033] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">

          {/* Brand - Mobile par full width (col-span-2), Desktop par 1 column */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <div className="flex items-center gap-3">
              {/* Logo Icon Badge */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#C87532]/40 bg-white p-0.5 shadow-md transition-transform duration-300 hover:scale-105">
                <img
                  src="/logo/corbett-logo 1.jpeg"
                  alt="Destination Corbett"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              {/* Brand Name & Tagline */}
              <div className="flex flex-col min-w-0 leading-none">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                    Destination
                  </span>
                  <span className="text-xl font-black tracking-tight text-[#C87532] sm:text-2xl">
                    Corbett
                  </span>
                </div>

                <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-widest">
                  Wild Safari & Luxury Stays
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70 sm:mt-5 sm:text-base sm:leading-7">
              Your complete Jim Corbett experience partner for stays, safaris,
              events and destination weddings.
            </p>
          </div>

          {/* Explore */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold sm:mb-5">Explore</h3>

            <div className="space-y-3 text-sm text-white/70 sm:text-base">
              <Link
                href="/"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Home
              </Link>
              <Link
                href="/stay"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Stay
              </Link>
              <Link
                href="/safari"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Safari
              </Link>
              <Link
                href="/packages"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Packages
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold sm:mb-5">Services</h3>

            <div className="space-y-3 text-sm text-white/70 sm:text-base">
              <Link
                href="/events"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Events
              </Link>
              <Link
                href="/weddings"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Destination Weddings
              </Link>
              <Link
                href="/transport"
                className="block transition-colors hover:text-[#C88A3D]"
              >
                Transportation
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-2 min-w-0 sm:col-span-1 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold sm:mb-5">Contact</h3>

            <div className="space-y-3 text-sm text-white/70 sm:text-base">
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#C88A3D]"
                />
                <p className="leading-6">Destination Corbett, Uttarakhand</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={17} className="shrink-0 text-[#C88A3D]" />
                <p>+91 9205299338</p>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <Mail size={17} className="mt-0.5 shrink-0 text-[#C88A3D]" />
                <p className="break-all">marketing@texora.ai</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs leading-6 text-white/50 sm:mt-12 sm:pt-6 sm:text-sm">
          <p>
            © {new Date().getFullYear()} Destination Corbett. All rights reserved.
          </p>

          <p className="mt-1">
            • Developed by{" "}
            <a
              href="mailto:marketing@texora.ai"
              className="text-white/70 transition-colors hover:text-[#C88A3D]"
            >
              Texora.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}