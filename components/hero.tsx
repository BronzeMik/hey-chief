"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "HEY CHIEF",
    subtitle: "STREETWEAR",
    description:
      "Premium streetwear caps that define your style. Bold designs, quality craftsmanship, authentic HeyChief culture.",
    backgroundImage: "/hero-slide-20.png",
    mobileBackgroundImage: "/mobile-hero-slide-1.png",
    buttonText: "SHOP NOW",
  },
  {
    id: 2,
    title: "HEYCHIEF",
    subtitle: "PREMIUM",
    description:
      "Crafted with the finest materials and HeyChief attention to detail. Each cap represents our commitment to quality and style.",
    backgroundImage: "/hero-slide-27.png",
    mobileBackgroundImage: "/mobile-hero-slide-3.png",
    buttonText: "EXPLORE",
  },
  {
    id: 3,
    title: "NAVY CHIEF",
    subtitle: "NAVY PRIDE",
    description:
      "Honor, courage, and commitment. Premium HeyChief Navy caps that represent the finest traditions of naval service and pride.",
    backgroundImage: "/hero-slide-19.png",
    mobileBackgroundImage: "/mobile-hero-slide-2.png",
    buttonText: "SERVE WITH PRIDE",
  },
  {
    id: 4,
    title: "HEYCHIEF",
    subtitle: "AUTHENTIC",
    description:
      "Representing the true HeyChief spirit. Wear your attitude, express your individuality with authentic style.",
    backgroundImage: "/hero-slide-28.png",
    mobileBackgroundImage: "/mobile-hero-slide-4.png",
    buttonText: "DISCOVER",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setIsAutoPlaying(false);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section
      className="
        relative w-full
        min-h-[70svh] md:min-h-[80svh] lg:min-h-[90svh]
        flex items-center justify-center overflow-hidden
        "
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== currentSlide}
        >
          {/* Background image with Next/Image for perf */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={slide.backgroundImage}
              alt=""
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover object-center hidden md:block"
              sizes="(max-width: 640px) 100vw,
                     (max-width: 1024px) 100vw,
                     100vw"
            />
            <Image
              src={slide.mobileBackgroundImage}
              alt=""
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover object-center md:hidden"
              sizes="(max-width: 640px) 100vw,
                     (max-width: 1024px) 100vw,
                     100vw"
            />
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Text/content */}
          <div className="relative z-10 w-full max-w-[1100px] px-5 sm:px-8">
            <div className="max-w-xl sm:max-w-2xl md:max-w-3xl">
              

              
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 sm:p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 sm:p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom bar: CTA + dots (mobile-friendly) */}
      <div className="absolute w-full bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 flex items-center justify-between gap-3 px-5 max-w-[1100px]">
        <Link href={"/products"}>
        <Button
        variant={"contained"}
          size="lg"
          className="cursor-pointer bg-[#ffde59] hover:bg-yellow-400 text-black font-semibold px-5 py-3"
        >
          Shop Now
        </Button>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-[#ffde59] scale-110"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
