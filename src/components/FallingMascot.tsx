"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

interface FallingMascotProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallDistance?: number
  duration?: number
  rotations?: number
  startScale?: number
  endScale?: number
  startRotateX?: number
  endRotateX?: number
  wobbleIntensity?: number
  triggerStart?: string
  ease?: string
  enableFloating?: boolean
  floatDistance?: number
  floatDuration?: number
}

export default function FallingMascot({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  fallDistance = 800,
  duration = 2,
  rotations = 1.5,
  startScale = 0.3,
  endScale = 1,
  startRotateX = 45,
  endRotateX = 0,
  wobbleIntensity = 30,
  triggerStart = "top 60%",
  ease = "power2.out",
  enableFloating = true,
  floatDistance = 15,
  floatDuration = 3,
}: FallingMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mascotRef = useRef<HTMLDivElement>(null)
  const floatAnimRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!containerRef.current || !mascotRef.current) return

    const ctx = gsap.context(() => {
      if (floatAnimRef.current) {
        floatAnimRef.current.kill()
      }

      gsap.set(mascotRef.current, {
        y: -fallDistance,
        scale: startScale,
        rotateX: startRotateX,
        rotateZ: -rotations * 360,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: "center center",
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: "play none none none",
        },
        onComplete: () => {
          if (enableFloating && mascotRef.current) {
            floatAnimRef.current = gsap.to(mascotRef.current, {
              y: `+=${floatDistance}`,
              duration: floatDuration,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })
          }
        },
      })

      tl.to(mascotRef.current, {
        y: 0,
        scale: endScale,
        rotateX: endRotateX,
        rotateZ: 0,
        opacity: 1,
        duration: duration,
        ease: ease,
      })

      gsap.to(mascotRef.current, {
        rotateY: wobbleIntensity,
        duration: duration / 4,
        repeat: 3,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: "play none none none",
        },
      })

      gsap.fromTo(
        mascotRef.current,
        { x: -20 },
        {
          x: 0,
          duration: duration,
          ease: "power1.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: triggerStart,
            toggleActions: "play none none none",
          },
        },
      )
    }, containerRef)

    return () => {
      if (floatAnimRef.current) {
        floatAnimRef.current.kill()
      }
      ctx.revert()
    }
  }, [
    fallDistance,
    duration,
    rotations,
    startScale,
    endScale,
    startRotateX,
    endRotateX,
    wobbleIntensity,
    triggerStart,
    ease,
    enableFloating,
    floatDistance,
    floatDuration,
  ])

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <div ref={mascotRef} className="w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto drop-shadow-2xl"
          draggable={false}
        />
      </div>
    </div>
  )
}
