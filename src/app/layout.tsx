/**
 * Root Layout for Overcast Video Classroom
 * 
 * This layout wraps all pages and provides:
 * - Custom futuristic fonts (Space Grotesk for display, JetBrains Mono for code)
 * - Dark theme background
 * - Global metadata
 */

import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Primary display font - bold geometric sans-serif for futuristic aesthetic
const spaceGrotesk = Space_Grotesk({
  variable: "--font-cabinet-grotesk", // Using this variable name to match theme config
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Monospace font for technical elements and code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Application metadata
export const metadata: Metadata = {
  title: "Overcast | Video Classroom",
  description: "AI Engineering Accelerator - Live video classroom platform powered by Overclock",
  keywords: ["AI", "engineering", "classroom", "video", "learning", "accelerator"],
  authors: [{ name: "Overclock Accelerator" }],
  openGraph: {
    title: "Overcast | Video Classroom",
    description: "AI Engineering Accelerator - Live video classroom platform",
    type: "website",
  },
};

/**
 * Root layout component that wraps all pages.
 * Provides font variables and base styling.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${jetbrainsMono.variable} 
          antialiased 
          bg-overcast-black 
          text-overcast-white
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}
