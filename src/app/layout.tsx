import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PlayerProvider } from "@/providers/PlayerProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { DemoProvider } from "@/providers/DemoProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juzzo — Discover Music, Watch Shorts",
  description:
    "Juzzo is a social media and music discovery platform. Explore the music globe, watch shorts, and connect with creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <DemoProvider>
            <PlayerProvider>
              {children}
            </PlayerProvider>
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
