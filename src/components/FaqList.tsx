"use client";

import React, { useState } from "react";

type Item = { id: string; question: string; answer: string };

// Convert markdown-style links [text](url) to HTML links
function renderAnswer(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-[#560700] underline decoration-[#560700]/40 hover:decoration-[#560700] transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

const colors = [
  "bg-[#BFDCFF]",  // Light blue
  "bg-[#D0FFCB]",  // Light green
  "bg-[#FFE4B3]",  // Light peach
  "bg-[#E6D4FF]",  // Light lavender
];

export default function FaqList({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items?.length) {
    return (
      <div className="bg-[#FFE4B3] rounded-3xl p-8 text-center">
        <p className="font-[family-name:var(--font-body)] text-gray-800 text-lg">
          No FAQ items yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const colorClass = colors[index % colors.length];

        return (
          <div
            key={item.id}
            className={`${colorClass} rounded-3xl overflow-hidden shadow-lg border-4 border-transparent hover:border-[#560700] transition-all duration-300 ${
              isOpen ? "border-[#560700]" : ""
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 group"
            >
              <span className="font-[family-name:var(--font-heading)] text-[#560700] text-xl md:text-2xl flex-1">
                {item.question}
              </span>
              <span
                className={`text-[#560700] text-2xl md:text-3xl transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <div className="pt-4 border-t-2 border-[#560700]/20">
                  <p className="font-[family-name:var(--font-body)] text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {renderAnswer(item.answer)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
