"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  {
    id: 1,
    name: "Service Track",
    description: "Create a program that helps people learn, stay organized, or improve their health and well-being.",
    color: "bg-[#D0FFCB]", // Light green
    tilt: 2,
  },
  {
    id: 2,
    name: "Finance Track",
    description: "Create a program that helps users manage money, improve financial literacy, or make informed financial decisions.",
    color: "bg-[#BFDCFF]", // Light blue
    tilt: -1.5,
  },
  {
    id: 3,
    name: "Gamification Track",
    description: "Create a program that transforms a mundane task into an engaging and fun experience through gamification.",
    color: "bg-[#E6D4FF]", // Light lavender
    tilt: 1.8,
  },
  {
    id: 4,
    name: "Art Track",
    description: "Create a program that showcases creativity through design, media, or interactive art.",
    color: "bg-[#FFC7E5]", // Light pink
    tilt: -2.2,
  },
];

export default function TracksSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Animate title on scroll into view
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Animate cards on scroll into view
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });
  }, []);

  const handleMouseEnter = (index: number, tilt: number) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.05,
        rotation: tilt,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <section id="tracks" className="w-full bg-[#FFE4B3] py-12 md:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 relative z-10">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-heading)] text-[#560700] text-4xl md:text-6xl mb-12"
        >
          TRACKS
        </h2>

        {/* Tracks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`${track.color} rounded-3xl p-8 md:p-10 shadow-lg relative overflow-visible border-4 border-transparent hover:shadow-2xl hover:border-[#560700] transition-all duration-500`}
              onMouseEnter={() => handleMouseEnter(index, track.tilt)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

              <h3 className="font-[family-name:var(--font-heading)] text-[#560700] text-2xl md:text-3xl mb-4 relative z-10">
                {track.name}
              </h3>

              <p className="font-[family-name:var(--font-body)] text-gray-800 text-base md:text-lg leading-relaxed relative z-10">
                {track.description}
              </p>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#560700] opacity-10 rounded-bl-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
