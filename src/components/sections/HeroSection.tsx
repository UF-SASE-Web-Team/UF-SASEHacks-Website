"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HACK_NAME, DATES, CITY, DISCORD_INVITE, DEVPOST_URL } from "@/lib/constants";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const shape4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating shapes animation
    if (shape1Ref.current) {
      gsap.to(shape1Ref.current, {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (shape2Ref.current) {
      gsap.to(shape2Ref.current, {
        y: 40,
        x: -30,
        rotation: -360,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (shape3Ref.current) {
      gsap.to(shape3Ref.current, {
        y: -25,
        x: -20,
        rotation: 180,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (shape4Ref.current) {
      gsap.to(shape4Ref.current, {
        y: 35,
        x: 25,
        rotation: -180,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

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
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE4B3] via-[#BFDCFF] to-[#D0FFCB]">
      {/* Floating decorative shapes */}
      <div ref={shape1Ref} className="absolute top-20 left-10 w-32 h-32 bg-[#FFC7E5] opacity-30 rounded-full blur-2xl" />
      <div ref={shape2Ref} className="absolute bottom-32 right-20 w-40 h-40 bg-[#E6D4FF] opacity-30 rounded-full blur-2xl" />
      <div ref={shape3Ref} className="absolute top-40 right-32 w-24 h-24 bg-[#D0FFCB] opacity-40 rounded-full blur-xl" />
      <div ref={shape4Ref} className="absolute bottom-20 left-32 w-36 h-36 bg-[#BFDCFF] opacity-40 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-12 md:py-20 text-center">
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
          Build something amazing in 24 hours. Meet new teammates, learn from mentors, and ship projects you'll be proud of!
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
        <div className="mt-16 animate-bounce">
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
