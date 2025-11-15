"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HACK_NAME, DATES, CITY, DISCORD_INVITE, DEVPOST_URL } from "@/lib/constants";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (badgesRef.current) {
      tl.fromTo(badgesRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });
    }
    if (titleRef.current) {
      tl.fromTo(titleRef.current, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, "-=0.3");
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");
    }
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE4B3] via-[#BFDCFF] to-[#D0FFCB]">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 text-center">
        {/* Location & Date Badges */}
        <div ref={badgesRef} className="flex flex-wrap gap-3 justify-center mb-6">
          <div className="inline-flex items-center rounded-full bg-[#560700] text-[#FFE4B3] px-5 py-2 text-sm md:text-base font-[family-name:var(--font-body)] font-semibold shadow-lg border-2 border-[#560700]">
            📍 {CITY}
          </div>
          <div className="inline-flex items-center rounded-full bg-white text-[#560700] px-5 py-2 text-sm md:text-base font-[family-name:var(--font-body)] font-semibold shadow-lg border-2 border-[#560700]">
            📅 {DATES}
          </div>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-[family-name:var(--font-heading)] text-[#560700] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 drop-shadow-lg"
        >
          {HACK_NAME}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-[family-name:var(--font-body)] text-[#560700] text-lg md:text-2xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
        >
          Build something amazing in 24 hours. Meet new teammates, learn from mentors, and ship projects you&apos;ll be proud of!
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/portal"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-[family-name:var(--font-heading)] text-xl md:text-2xl bg-[#560700] text-[#FFE4B3] hover:scale-105 transition-transform duration-300 shadow-xl border-4 border-[#560700] w-full sm:w-auto"
          >
            REGISTER NOW
          </a>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-[family-name:var(--font-heading)] text-xl md:text-2xl bg-white text-[#560700] hover:scale-105 transition-transform duration-300 shadow-xl border-4 border-[#560700] w-full sm:w-auto"
          >
            JOIN DISCORD
          </a>
          <a
            href={DEVPOST_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-[family-name:var(--font-heading)] text-xl md:text-2xl bg-white text-[#560700] hover:scale-105 transition-transform duration-300 shadow-xl border-4 border-[#560700] w-full sm:w-auto"
          >
            DEVPOST
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <div className="inline-block text-[#560700] text-4xl opacity-60">
            ↓
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
