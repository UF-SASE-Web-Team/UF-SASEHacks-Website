"use client";

import { DISCORD_INVITE, DEVPOST_URL } from "@/lib/constants";
import FaqList from "@/components/FaqList";
import type { FaqItem } from "@/lib/notion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  faqItems: FaqItem[];
};

export default function FaqSection({ faqItems }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
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

    // Animate FAQ list
    if (faqListRef.current) {
      gsap.fromTo(
        faqListRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faqListRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Animate buttons
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  return (
    <section id="faq" className="w-full bg-[#FFC7E5] min-h-screen flex items-center relative overflow-hidden py-12">
      <div className="mx-auto max-w-screen-xl px-4 w-full">
        {/* Section title */}
        <h2 ref={titleRef} className="font-[family-name:var(--font-heading)] text-[#560700] text-4xl md:text-6xl mb-12 text-center">
          FAQ
        </h2>

        {/* FAQ List */}
        <div ref={faqListRef} className="mb-12">
          <FaqList items={faqItems} />
        </div>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-[family-name:var(--font-heading)] text-lg md:text-xl bg-[#560700] text-[#FFE4B3] hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Join Discord
          </a>
          <a
            href={DEVPOST_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-[family-name:var(--font-heading)] text-lg md:text-xl bg-[#FFE4B3] text-[#560700] border-4 border-[#560700] hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Devpost
          </a>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-[#560700] opacity-10 rounded-full" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#560700] opacity-10 rounded-full" />
      </div>
    </section>
  );
}
