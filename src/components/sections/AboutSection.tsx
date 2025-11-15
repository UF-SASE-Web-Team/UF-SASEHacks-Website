"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPublicImageUrl } from "@/lib/supabase/storage";

gsap.registerPlugin(ScrollTrigger);

const carouselImages = [
  { id: 1, src: getPublicImageUrl("gbm-4-s25.jpg"), alt: "GBM 4" },
  { id: 2, src: getPublicImageUrl("gbm-4-s25.jpg"), alt: "Event Photo 2" },
  { id: 3, src: getPublicImageUrl("gbm-4-s25.jpg"), alt: "Event Photo 3" },
];

export default function AboutSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sharkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title
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

    // Animate content box
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Animate shark
    if (sharkRef.current) {
      gsap.fromTo(
        sharkRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sharkRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  // Infinite scroll
  const repeatedImages = [...carouselImages, ...carouselImages, ...carouselImages, ...carouselImages];

  return (
    <section id="about" className="w-full bg-[#BFDCFF] relative overflow-hidden min-h-screen flex items-center">
      {/* Desktop: Carousel on right side touching top and bottom */}
      <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden">
        <div className="animate-scroll-vertical h-[200%]">
          <div className="flex flex-col">
            {repeatedImages.map((item, index) => (
              <div
                key={`desktop-${item.id}-${index}`}
                className="w-full h-96 relative overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Carousel at bottom touching left and right */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-96 overflow-hidden">
        <div className="animate-scroll-horizontal flex h-full">
          <div className="flex h-full">
            {repeatedImages.map((item, index) => (
              <div
                key={`mobile-${item.id}-${index}`}
                className="min-w-[400px] h-full relative overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 w-full pb-80 md:pb-96 lg:pb-[500px]">
        {/* ABOUT US title */}
        <h2 ref={titleRef} className="font-[family-name:var(--font-heading)] text-[#560700] text-4xl md:text-6xl mb-12">
          ABOUT US
        </h2>

        {/* Left side content - takes up left half on desktop */}
        <div className="lg:w-1/2 lg:pr-8">
          {/* Green text box with shadow */}
          <div ref={contentRef} className="bg-[#D0FFCB] rounded-3xl p-8 md:p-10 shadow-lg">
            <p className="font-[family-name:var(--font-body)] text-gray-800 text-lg md:text-xl leading-relaxed">
              SASEHacks will be a 24 hour long hackathon where students make a project that
              solves a real world problem, showcases their technical creativity, and brings their
              unique perspective to life through code. During the event, students can attend workshops,
              network with other hackers, and listen to leaders in the Computer Science field.
            </p>
          </div>
        </div>
      </div>

      {/* Shark mascot - anchored to bottom left */}
      <div ref={sharkRef} className="absolute bottom-0 left-0 md:left-8 lg:left-16 z-20 pointer-events-none">
        <Image
          src={getPublicImageUrl("shark-mascot.png")}
          alt="Shark Mascot"
          width={500}
          height={500}
          className="w-72 md:w-96 lg:w-[500px] h-auto drop-shadow-2xl"
          priority
        />
      </div>

      <style jsx>{`
        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-vertical {
          animation: scroll-vertical 30s linear infinite;
        }

        .animate-scroll-horizontal {
          animation: scroll-horizontal 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
