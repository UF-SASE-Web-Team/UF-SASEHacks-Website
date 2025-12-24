"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPublicImageUrl } from "@/lib/supabase/storage";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const aboutStackRef = useRef<HTMLDivElement>(null);
  const usStackRef = useRef<HTMLDivElement>(null);
  
  const shapeBlueRef = useRef<HTMLDivElement>(null);
  const shapeYellowRef = useRef<HTMLDivElement>(null);
  const shapeOrangeRef = useRef<HTMLDivElement>(null);
  const shapeGreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      //floating block stacks
      gsap.to(aboutStackRef.current, {
        y: -20,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(usStackRef.current, {
        y: -15,
        duration: 3,
        delay: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      //falling mascot
      gsap.fromTo(
        mascotRef.current,
        { y: -600, opacity: 0, rotate: -20 },
        {
          y: 0,
          opacity: 1,
          rotate: -5,
          duration: 1.8,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
          },
        }
      );

      //shapes animation
      const shapes = [shapeBlueRef, shapeYellowRef, shapeOrangeRef, shapeGreenRef];
      shapes.forEach((ref, i) => {
        gsap.to(ref.current, {
          y: -20,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center pt-0 pb-20"
    >
      {/* background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={getPublicImageUrl("about/aboutBackground.png")} 
          alt="Cloud Background" fill className="object-cover object-bottom" priority
        />
      </div>

      {/* floating shapes */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* yellow block */}
        <div ref={shapeYellowRef} className="absolute bottom-0 left-[1%] md:bottom-0 md:left-[2%] w-24 md:w-32">
             <Image src={getPublicImageUrl("about/aboutYellowBlock.png")} alt="Yellow" width={140} height={90} />
        </div>
        {/* blue block */}
        <div ref={shapeBlueRef} className="absolute bottom-0 left-[12%] md:bottom-0 md:left-[15%] w-28 md:w-40">
             <Image src={getPublicImageUrl("about/aboutBlueBlock.png")} alt="Blue" width={180} height={120} />
        </div>
        {/* orange block */}
        <div ref={shapeOrangeRef} className="absolute bottom-0 left-[24%] md:bottom-0 md:left-[28%] w-20 md:w-28">
             <Image src={getPublicImageUrl("about/aboutOrangeBlock.png")} alt="Orange" width={120} height={120} />
        </div>
        {/* green block */}
        <div ref={shapeGreenRef} className="absolute bottom-0 left-[36%] md:bottom-0 md:left-[40%] w-16 md:w-24">
             <Image src={getPublicImageUrl("about/aboutGreenBlock.png")} alt="Green" width={100} height={100} />
        </div>
      </div>

      <div className="container mx-auto px-6 z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* text modal */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-[3rem] shadow-2xl border-4 border-white transform -rotate-1 max-w-lg">
            <h2 className="font-[family-name:var(--font-heading)] text-[#560700] text-5xl md:text-6xl mb-6">
              ABOUT US
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[#560700] text-lg md:text-xl leading-relaxed font-medium">
              SASEHacks will be a 24 hour long hackathon where students make a project that
              solves a real world problem, showcases their technical creativity, and brings their
              unique perspective to life through code.
            </p>
          </div>
        </div>

        {/* about us blocks */}
        <div className="lg:col-span-7 relative h-[600px] md:h-[800px] w-full flex justify-center items-end order-1 lg:order-2">
          <div className="relative w-full max-w-[900px] h-full flex items-end justify-end pr-4 md:pr-8 pb-0">
            
            {/* about stack */}
            <div ref={aboutStackRef} className="relative z-20 w-[90%] md:w-[93%] mb-[-11%] -mr-10 md:-mr-20">
              <Image 
                src={getPublicImageUrl("about/aboutBlocks.png")} 
                alt="About Blocks" width={1500} height={2400} className="w-full h-auto drop-shadow-xl"
              />
            </div>

            {/* us stack */}
            <div ref={usStackRef} className="relative z-10 w-[35%] md:w-[31%] mb-[-12%] md:-ml-20">
              <div className="relative w-full">
                <Image 
                  src={getPublicImageUrl("about/usBlocks.png")} 
                  alt="Us Blocks" width={300} height={460} className="w-full h-auto drop-shadow-xl"
                />
                
                {/* mascot */}
                <div 
                  ref={mascotRef} 
                  className="absolute top-[-68%] md:top-[-72%] right-[-15%] md:right-[-15%] w-[125%] md:w-[130%] z-30"
                >
                  <Image 
                    src={getPublicImageUrl("about/aboutMascot.png")} 
                    alt="Shark Mascot" width={400} height={400} className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}