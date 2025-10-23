import React from "react";

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
        className="font-medium text-gray-900 underline decoration-gray-400 hover:decoration-gray-900 transition-colors"
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

export default function FaqList({ items }: { items: Item[] }) {
  if (!items?.length) {
    return <p className="text-sm text-gray-600">No FAQ items yet.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((it) => (
        <details key={it.id} className="rounded-lg border p-4">
          <summary className="font-medium cursor-pointer">{it.question}</summary>
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
            {renderAnswer(it.answer)}
          </p>
        </details>
      ))}
    </div>
  );
}
