"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SponsorsSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("ufsase.evp@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sponsors" className="w-full bg-[#D0FFCB] min-h-screen flex items-center relative overflow-hidden py-12">
      <div className="mx-auto max-w-screen-xl px-4 relative z-10 w-full">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-heading)] text-[#560700] text-4xl md:text-6xl mb-12 text-center"
        >
          BECOME A SPONSOR
        </h2>

        {/* Main CTA Card */}
        <div
          ref={ctaRef}
          className="bg-[#FFE4B3] rounded-3xl p-8 md:p-12 shadow-2xl mb-12 max-w-4xl mx-auto border-4 border-[#560700] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#560700] opacity-5 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#560700] opacity-5 rounded-tr-full" />

          <h3 className="font-[family-name:var(--font-heading)] text-[#560700] text-3xl md:text-4xl mb-6 text-center relative z-10">
            Support Innovation at UF
          </h3>

          <p className="font-[family-name:var(--font-body)] text-gray-800 text-lg md:text-xl leading-relaxed mb-8 text-center max-w-2xl mx-auto relative z-10">
            Help us create an amazing experience for student developers. Your sponsorship enables us to provide
            resources, prizes, mentorship, and unforgettable opportunities for participants.
          </p>

          {/* Email Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto relative z-10">
            <p className="font-[family-name:var(--font-body)] text-gray-600 text-sm mb-3 text-center">
              Get in touch with us:
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#BFDCFF] rounded-lg px-4 py-3 font-[family-name:var(--font-body)] text-[#560700] font-semibold text-center">
                ufsase.evp@gmail.com
              </div>
              <button
                onClick={copyEmail}
                className="bg-[#560700] text-[#FFE4B3] px-6 py-3 rounded-lg font-[family-name:var(--font-body)] font-semibold hover:opacity-90 transition-opacity"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center relative z-10">
            <a
              href="mailto:ufsase.evp@gmail.com?subject=Sponsorship Inquiry for UF SASEHacks"
              className="inline-block bg-[#560700] text-[#FFE4B3] px-8 py-4 rounded-2xl font-[family-name:var(--font-heading)] text-xl md:text-2xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              EMAIL US
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="font-[family-name:var(--font-body)] text-gray-800 text-lg max-w-3xl mx-auto">
            We offer various sponsorship tiers to fit your organization&apos;s goals and budget.
            Reach out to discuss custom sponsorship packages!
          </p>
        </div>
      </div>
    </section>
  );
}
