"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroData } from "@/data/hero";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroData.images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-162.5 overflow-hidden">

      {/* Hero Images */}
      {heroData.images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt="Jim Corbett"
          fill
          sizes="100vw"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          className={`object-cover object-center transition-opacity duration-1000 ${
            currentImage === index
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25">

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-162.5 flex items-center">
        <div className="max-w-2xl text-white">

          <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-5">
            {heroData.eyebrow}
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            {heroData.title}
          </h1>

          <p className="text-lg text-white/85 leading-8 mb-8 max-w-xl">
            {heroData.description}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {heroData.buttons.map((button) => (
              <Link
                key={button.text}
                href={button.href}
                className="inline-flex items-center bg-[#C88A3D] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#A96F2E] transition"
              >
                {button.text}
              </Link>
            ))}
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}