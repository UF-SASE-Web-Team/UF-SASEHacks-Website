"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import FallingMascot from "@/components/FallingMascot";

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  {
    id: 1,
    name: "Service Track",
    description: "Create a program that helps people learn, stay organized, or improve their health and well-being.",
  },
  {
    id: 2,
    name: "Finance Track",
    description: "Create a program that helps users manage money, improve financial literacy, or make informed financial decisions.",
  },
  {
    id: 3,
    name: "Gamification Track",
    description: "Create a program that transforms a mundane task into an engaging and fun experience through gamification.",
  },
  {
    id: 4,
    name: "Art Track",
    description: "Create a program that showcases creativity through design, media, or interactive art.",
  },
];

export default function TracksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubble1Ref = useRef<HTMLDivElement>(null);
  const bubble2Ref = useRef<HTMLDivElement>(null);
  const bubble3Ref = useRef<HTMLDivElement>(null);
  const bubble4Ref = useRef<HTMLDivElement>(null);
  const smallBubbles1Ref = useRef<HTMLDivElement>(null);
  const smallBubbles2Ref = useRef<HTMLDivElement>(null);
  const reefsRef = useRef<HTMLDivElement>(null);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bubbles = [
        { ref: bubble1Ref, dur: 3.5, delay: 0 },
        { ref: bubble2Ref, dur: 4, delay: 0.5 },
        { ref: bubble3Ref, dur: 3.2, delay: 1 },
        { ref: bubble4Ref, dur: 3.8, delay: 0.2 },
      ];

      bubbles.forEach((b) => {
        if (b.ref.current) {
          gsap.to(b.ref.current, {
            y: -20,
            duration: b.dur,
            delay: b.delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });

      if (smallBubbles1Ref.current) {
        gsap.to(smallBubbles1Ref.current, {
          y: -40,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (smallBubbles2Ref.current) {
        gsap.to(smallBubbles2Ref.current, {
          y: -30,
          duration: 4.5,
          delay: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (reefsRef.current) {
        gsap.to(reefsRef.current, {
          x: 15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="tracks" 
      ref={containerRef} 
      className="relative w-full min-h-[70vh] sm:min-h-[130vh] md:min-h-[90vh] lg:min-h-[130vh] overflow-hidden bg-[#7CD0E0] pt-24 md:pt-40"
      onClick={() => setActiveTrack(null)}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={getPublicImageUrl("track/trackBackground.png")}
          alt="Underwater Background"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
      </div>

      {/* --- Decor Bubbles --- */}
      
      {/* Small Bubbles Left */}
      <div
        ref={smallBubbles1Ref}
        className="absolute top-[30%] left-[40%] lg:top-[25%] w-[30%] sm:w-[25%] md:w-[20%] lg:w-[20%] z-10 pointer-events-none opacity-70"
      >
        <Image
          src={getPublicImageUrl("track/trackSmallBubbles1.png")}
          alt="Small Bubbles"
          width={200}
          height={400}
          className="w-full h-auto" 
          unoptimized
        />
      </div>

      {/* Small Bubbles Right */}
      <div
        ref={smallBubbles2Ref}
        className="absolute top-[35%] right-[2%] sm:right-[3%] lg:right-[2%] w-[20%] sm:w-[20%] lg:w-[12%] z-10 pointer-events-none opacity-70"
      >
        <Image
          src={getPublicImageUrl("track/trackSmallBubbles2.png")}
          alt="Small Bubbles"
          width={200}
          height={350}
          className="w-full h-auto"
          unoptimized
        />
      </div>


      {/* --- TRACK 1: Service --- */}
      <div 
        ref={bubble1Ref}
        onClick={(e) => { e.stopPropagation(); setActiveTrack(activeTrack === 1 ? null : 1); }}
        className="absolute top-[8%] left-[2%] sm:top-[10%] md:top-[5%] md:left-[5%] w-[42%] sm:w-[40%] md:w-[35%] lg:w-[25%] z-20 group cursor-pointer isolate"
      >
        <div className="relative w-full aspect-square">
          <Image
            src={getPublicImageUrl("track/trackBubble1.png")}
            alt="Service Track Bubble"
            fill
            className="object-contain mix-blend-multiply opacity-90 rounded-full"
            unoptimized
          />
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 transition-all duration-300">
            {/* Title */}
            <h3 className={`font-[family-name:var(--font-heading)] text-[#560700] text-xl md:text-3xl lg:text-4xl text-center transition-opacity duration-300 absolute w-full px-4 ${activeTrack === 1 ? "opacity-0" : "group-hover:opacity-0"}`}>
              {tracks[0].name}
            </h3>
            {/* Description */}
            <p className={`font-[family-name:var(--font-body)] text-[#560700] text-xs md:text-sm lg:text-base text-center leading-tight transition-opacity duration-300 absolute w-full px-6 md:px-10 ${activeTrack === 1 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {tracks[0].description}
            </p>
          </div>
        </div>
      </div>

      {/* --- TRACK 2: Finance --- */}
      <div 
        ref={bubble2Ref}
        onClick={(e) => { e.stopPropagation(); setActiveTrack(activeTrack === 2 ? null : 2); }}
        className="absolute top-[8%] right-[2%] sm:top-[10%] md:top-[5%] md:right-[5%] w-[42%] sm:w-[40%] md:w-[35%] lg:w-[25%] z-20 group cursor-pointer isolate"
      >
        <div className="relative w-full aspect-square">
          <div className="absolute inset-0 transform -scale-x-100">
            <Image
              src={getPublicImageUrl("track/trackBubble1.png")}
              alt="Finance Track Bubble"
              fill
              className="object-contain mix-blend-multiply opacity-90 rounded-full"
              unoptimized
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 transition-all duration-300">
             <h3 className={`font-[family-name:var(--font-heading)] text-[#560700] text-xl md:text-3xl lg:text-4xl text-center transition-opacity duration-300 absolute w-full px-4 ${activeTrack === 2 ? "opacity-0" : "group-hover:opacity-0"}`}>
              {tracks[1].name}
            </h3>
            <p className={`font-[family-name:var(--font-body)] text-[#560700] text-xs md:text-sm lg:text-base text-center leading-tight transition-opacity duration-300 absolute w-full px-6 md:px-10 ${activeTrack === 2 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {tracks[1].description}
            </p>
          </div>
        </div>
      </div>

      <div 
        className="absolute top-[32%] left-[50%] -translate-x-1/2 w-[35%] sm:w-[30%] md:w-[27%] lg:w-[22%] z-20 pointer-events-none overflow-visible isolate drop-shadow-none"
      >
        <FallingMascot
          src={getPublicImageUrl("track/trackBubbleMascot.png")}
          alt="Mascot in Bubble"
          fallDistance={500}
          duration={2.5}
          rotations={0.5}
          startScale={0.1}
          endScale={1}
          startRotateX={40}
          wobbleIntensity={20}
          triggerStart="top 70%"
          ease="power3.out"
          floatDistance={25}
          floatDuration={3}
        />
      </div>

      {/* --- TRACK 3: Gamification --- */}
      <div 
        ref={bubble3Ref}
        onClick={(e) => { e.stopPropagation(); setActiveTrack(activeTrack === 3 ? null : 3); }}
        className="absolute bottom-[13%] left-[3%] lg:bottom-[15%] lg:left-[5%] sm:bottom-[20%] md:bottom-[20%] md:left-[8%] w-[42%] md:w-[35%] lg:w-[25%] z-20 group cursor-pointer isolate"
      >
        <div className="relative w-full aspect-square">
          <Image
            src={getPublicImageUrl("track/trackBubble2.png")}
            alt="Gamification Track Bubble"
            fill
            unoptimized
            className="object-contain mix-blend-multiply opacity-90 rounded-full"
          />
           <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 transition-all duration-300">
             <h3 className={`font-[family-name:var(--font-heading)] text-[#560700] text-lg md:text-2xl lg:text-3xl text-center transition-opacity duration-300 absolute w-full px-4 ${activeTrack === 3 ? "opacity-0" : "group-hover:opacity-0"}`}>
              {tracks[2].name}
            </h3>
            <p className={`font-[family-name:var(--font-body)] text-[#560700] text-xs md:text-sm lg:text-base text-center leading-tight transition-opacity duration-300 absolute w-full px-6 md:px-10 ${activeTrack === 3 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {tracks[2].description}
            </p>
          </div>
        </div>
      </div>

      {/* --- TRACK 4: Art --- */}
      <div 
        ref={bubble4Ref}
        onClick={(e) => { e.stopPropagation(); setActiveTrack(activeTrack === 4 ? null : 4); }}
        className="absolute bottom-[13%] right-[2%] sm:bottom-[20%] lg:bottom-[15%] lg:right-[6%] md:bottom-[20%] md:right-[8%] w-[42%] md:w-[35%] lg:w-[25%] z-20 group cursor-pointer isolate"
      >
        <div className="relative w-full aspect-square">
           <div className="absolute inset-0 transform -scale-x-100">
            <Image
              src={getPublicImageUrl("track/trackBubble2.png")}
              alt="Art Track Bubble"
              fill
              unoptimized
              className="object-contain mix-blend-multiply opacity-90 rounded-full"
            />
          </div>

           <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 transition-all duration-300">
             <h3 className={`font-[family-name:var(--font-heading)] text-[#560700] text-lg md:text-2xl lg:text-3xl text-center transition-opacity duration-300 absolute w-full px-4 ${activeTrack === 4 ? "opacity-0" : "group-hover:opacity-0"}`}>
              {tracks[3].name}
            </h3>
            <p className={`font-[family-name:var(--font-body)] text-[#560700] text-xs md:text-sm lg:text-base text-center leading-tight transition-opacity duration-300 absolute w-full px-6 md:px-10 ${activeTrack === 4 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {tracks[3].description}
            </p>
          </div>
        </div>
      </div>

      {/* --- Reefs --- */}
      <div ref={reefsRef} className="absolute bottom-0 left-[-10%] md:left-[-2%] lg:left-[-2%] w-[160%] sm:w-[140%] md:w-full lg:w-full z-10 pointer-events-none origin-bottom">
        <Image
          src={getPublicImageUrl("track/trackReefs.png")}
          alt="Underwater Reefs"
          width={1920}
          height={300}
          className="w-full h-auto object-contain object-bottom"
          unoptimized
        />
      </div>
    </section>
  );
}