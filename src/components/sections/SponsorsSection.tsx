"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/supabase/storage";

gsap.registerPlugin(ScrollTrigger);

export default function SponsorsSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

    // Animate CTA card
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    if (mascotRef.current) {
      gsap.to(mascotRef.current, {
        y: -20,
        rotation: 3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("ufsase.evp@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sponsors" className="w-full min-h-screen flex items-center relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 z-0">
        <Image src={getPublicImageUrl("sponsor/sponsorBackground.png")} alt="Sponsor Background" fill className="object-cover" priority />
      </div>

      <div
        ref={mascotRef}
        className="absolute right-4 -bottom-12 md:right-20 md:bottom-32 lg:right-32 z-20 w-32 md:w-48 lg:w-64"
      >
        <Image
          src={getPublicImageUrl("sponsor/sponsorMascot.png")}
          alt="Sponsor Mascot"
          width={400}
          height={400}
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>

      <div className="mx-auto max-w-screen-xl px-4 md:px-8 relative z-10 w-full">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-heading)] text-white text-3xl md:text-5xl lg:text-6xl mb-8 md:mb-12 text-center drop-shadow-lg"
        >
          BECOME A SPONSOR
        </h2>

        {/* Main CTA Card */}
        <div
          ref={ctaRef}
          className="bg-[#FFE4B3] rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl mb-8 md:mb-12 max-w-3xl mx-auto border-4 border-[#560700] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#560700] opacity-5 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#560700] opacity-5 rounded-tr-full" />

          <h3 className="font-[family-name:var(--font-heading)] text-[#560700] text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 text-center relative z-10">
            Support Innovation at UF
          </h3>

          <p className="font-[family-name:var(--font-body)] text-gray-800 text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 text-center max-w-2xl mx-auto relative z-10">
            Help us create an amazing experience for student developers. Your sponsorship enables us to provide
            resources, prizes, mentorship, and unforgettable opportunities for participants.
          </p>

          {/* Email Contact */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg max-w-md mx-auto relative z-10">
            <p className="font-[family-name:var(--font-body)] text-gray-600 text-sm mb-3 text-center">
              Get in touch with us:
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-[#BFDCFF] rounded-lg px-3 md:px-4 py-2 md:py-3 font-[family-name:var(--font-body)] text-[#560700] font-semibold text-center text-sm md:text-base break-all">
                ufsase.evp@gmail.com
              </div>
              <button
                onClick={copyEmail}
                className="bg-[#560700] text-[#FFE4B3] px-4 md:px-6 py-2 md:py-3 rounded-lg font-[family-name:var(--font-body)] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 text-sm md:text-base"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 md:mt-8 text-center relative z-10">
            <a
              href="mailto:ufsase.evp@gmail.com?subject=Sponsorship Inquiry for UF SASEHacks"
              className="inline-block bg-[#560700] text-[#FFE4B3] px-6 md:px-8 py-3 md:py-4 rounded-2xl font-[family-name:var(--font-heading)] text-lg md:text-xl lg:text-2xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              EMAIL US
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-[family-name:var(--font-body)] text-white text-base md:text-lg drop-shadow-lg">
            We offer various sponsorship tiers to fit your organization&apos;s goals and budget. Reach out to discuss
            custom sponsorship packages!
          </p>
        </div>
      </div>
    </section>
  );
}