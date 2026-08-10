import type { Metadata } from "next";
import "./globals.css";

import { LanguageProvider } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";

export const metadata: Metadata = {
  title: "Life Organizer",
  description: "Organize your tasks, calendar, notes and more — beautifully.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen antialiased">
        <Starfield />

        <LanguageProvider>
          <div className="relative z-10">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
