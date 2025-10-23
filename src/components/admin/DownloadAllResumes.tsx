"use client";

import { useState, useTransition } from "react";
import { getAllResumeLinks } from "@/app/admin/actions";
import JSZip from "jszip";

export default function DownloadAllResumes() {
  const [busy, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const sanitizeFilename = (name: string) => {
    return name
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .trim();
  };

  const handleDownload = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await getAllResumeLinks();
        if (!result.ok || !result.links) {
          setMessage(`Error: ${result.error ?? "Failed to get resume links"}`);
          return;
        }

        const validLinks = result.links.filter(l => l.url && l.name);
        if (validLinks.length === 0) {
          setMessage("No resumes found.");
          return;
        }

        setMessage(`Creating ZIP with ${validLinks.length} resume(s)...`);

        // Create a new ZIP file
        const zip = new JSZip();

        // Download and add each file to the ZIP
        for (let i = 0; i < validLinks.length; i++) {
          const link = validLinks[i];
          const nameParts = link.name?.split(" ") ?? [];
          const firstName = nameParts[0] ?? "Unknown";
          const lastName = nameParts.slice(1).join("_") || "User";
          const sanitizedFirst = sanitizeFilename(firstName);
          const sanitizedLast = sanitizeFilename(lastName);
          const filename = `${i + 1}_${sanitizedFirst}_${sanitizedLast}.pdf`;

          if (link.url) {
            try {
              const response = await fetch(link.url);
              const blob = await response.blob();
              zip.file(filename, blob);
            } catch (error) {
              console.error(`Failed to fetch ${filename}:`, error);
            }
          }
        }

        setMessage("Generating ZIP file...");

        // Generate the ZIP file
        const zipBlob = await zip.generateAsync({ type: "blob" });

        // Create download link
        const zipUrl = window.URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = zipUrl;
        a.download = `resumes_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(zipUrl);

        setMessage(`Successfully downloaded ${validLinks.length} resume(s) as ZIP.`);
      } catch (error) {
        console.error("Download error:", error);
        setMessage("Failed to create ZIP file.");
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDownload}
        disabled={busy}
        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {busy ? "Creating ZIP..." : "Download all resumes"}
      </button>
      {message && (
        <p className="text-xs text-gray-600">{message}</p>
      )}
    </div>
  );
}
