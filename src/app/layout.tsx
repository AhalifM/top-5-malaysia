import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import FirebaseAnalytics from "@/components/site/FirebaseAnalytics";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swifty Agency — TikTok Content Creation Malaysia",
  description: "Affordable UGC content creation for TikTok & Instagram Reels. 20+ creators, 90% cheaper than traditional agencies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full antialiased">
        <FirebaseAnalytics />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
