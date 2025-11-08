"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScheduleEvent = {
  time: string;
  title: string;
  location?: string;
  color: string;
};

const saturdayEvents: ScheduleEvent[] = [
  { time: "7:00 AM", title: "Check-In & Registration", location: "Newell Hall", color: "bg-[#D0FFCB]" },
  { time: "8:00 AM", title: "Opening Ceremony", location: "Turlington", color: "bg-[#FFE4B3]" },
  { time: "9:00 AM", title: "Team Formation", location: "Throughout Venue", color: "bg-[#E6D4FF]" },
  { time: "10:00 AM", title: "Hacking Begins!", location: "Newell / Marston", color: "bg-[#FFC7E5]" },
  { time: "11:00 AM", title: "Mini-Workshops", location: "Turlington", color: "bg-[#D0FFCB]" },
  { time: "2:00 PM", title: "Mentor Check-Ins", location: "Newell Hall", color: "bg-[#FFE4B3]" },
  { time: "4:00 PM", title: "Technical Workshops", location: "Various Rooms", color: "bg-[#E6D4FF]" },
  { time: "4:30 PM", title: "Food Break", location: "Turlington", color: "bg-[#FFC7E5]" },
  { time: "9:00 PM", title: "Wellness Activity", location: "TBA", color: "bg-[#D0FFCB]" },
  { time: "10:00 PM", title: "Late Night Snacks", location: "Main Area", color: "bg-[#FFE4B3]" },
];

const sundayEvents: ScheduleEvent[] = [
  { time: "8:00 AM", title: "Breakfast", location: "Main Area", color: "bg-[#E6D4FF]" },
  { time: "10:00 AM", title: "Project Submissions Close", color: "bg-[#FFC7E5]" },
  { time: "10:30 AM", title: "Judging Begins", location: "Reitz Meeting Rooms", color: "bg-[#D0FFCB]" },
  { time: "12:30 PM", title: "Awards & Closing Ceremony", location: "Main Hall", color: "bg-[#FFE4B3]" },
  { time: "1:30 PM", title: "Event Ends", color: "bg-[#E6D4FF]" },
];

export default function ScheduleSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [selectedDay, setSelectedDay] = useState<"saturday" | "sunday">("saturday");

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -20 },
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
  }, []);

  const events = selectedDay === "saturday" ? saturdayEvents : sundayEvents;

  return (
    <section id="schedule" className="w-full bg-[#BFDCFF] py-12 md:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-heading)] text-[#560700] text-4xl md:text-6xl mb-8 text-center"
        >
          SCHEDULE
        </h2>

        {/* Day Selector */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedDay("saturday")}
            className={`px-8 py-4 rounded-2xl font-[family-name:var(--font-heading)] text-xl md:text-2xl transition-all duration-300 shadow-lg border-4 ${
              selectedDay === "saturday"
                ? "bg-[#560700] text-[#FFE4B3] border-[#560700] scale-105"
                : "bg-[#FFE4B3] text-[#560700] border-[#560700] hover:scale-105"
            }`}
          >
            DAY 1
          </button>
          <button
            onClick={() => setSelectedDay("sunday")}
            className={`px-8 py-4 rounded-2xl font-[family-name:var(--font-heading)] text-xl md:text-2xl transition-all duration-300 shadow-lg border-4 ${
              selectedDay === "sunday"
                ? "bg-[#560700] text-[#FFE4B3] border-[#560700] scale-105"
                : "bg-[#FFE4B3] text-[#560700] border-[#560700] hover:scale-105"
            }`}
          >
            DAY 2
          </button>
        </div>

        {/* Date Labels */}
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-heading)] text-[#560700] text-2xl md:text-3xl">
            {selectedDay === "saturday" ? "SATURDAY" : "SUNDAY"}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-32 top-0 bottom-0 w-1 bg-[#560700]/20" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="relative flex items-start gap-4 md:gap-8 group"
              >
                {/* Time Badge */}
                <div className="w-24 md:w-32 flex-shrink-0">
                  <div className="bg-[#560700] text-[#FFE4B3] rounded-xl px-3 py-2 text-center shadow-lg">
                    <span className="font-[family-name:var(--font-body)] font-bold text-sm md:text-base">
                      {event.time}
                    </span>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-[1.6rem] md:left-[7.6rem] top-3 w-4 h-4 bg-[#560700] rounded-full border-4 border-[#BFDCFF] z-10 group-hover:scale-150 transition-transform duration-300" />

                {/* Event Card */}
                <div className={`flex-1 ${event.color} rounded-2xl p-4 md:p-6 shadow-lg border-4 border-transparent hover:border-[#560700] transition-all duration-300 hover:scale-105`}>
                  <h3 className="font-[family-name:var(--font-heading)] text-[#560700] text-lg md:text-xl mb-1">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="font-[family-name:var(--font-body)] text-gray-700 text-sm md:text-base">
                      📍 {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="font-[family-name:var(--font-body)] text-gray-800 text-sm md:text-base max-w-2xl mx-auto">
            Schedule is subject to change. Stay tuned for updates closer to the event!
          </p>
        </div>
      </div>
    </section>
  );
}
