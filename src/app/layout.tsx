import type { Metadata } from "next";
import "./globals.css";
import { HACK_NAME, DATES, CITY, DOMAIN } from "@/lib/constants";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: `${HACK_NAME}`,
  description: `${HACK_NAME} is a community hackathon in ${CITY}. Join us on ${DATES}.`,
  metadataBase: new URL(
    `https://${DOMAIN}`.includes("{{your-domain.com}}")
      ? "http://localhost:3000"
      : `https://${DOMAIN}`
  ),
  openGraph: {
    title: `${HACK_NAME}`,
    description: `Build with us in ${CITY}.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${HACK_NAME} - ${DATES}`,
    description: `Build with us in ${CITY}.`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-screen-xl px-4 py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} {HACK_NAME}. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}