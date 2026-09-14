import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import TickerTape from "@/components/TickerTape";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { AuthProvider } from "@/lib/AuthContext";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "FinStock AI — วิเคราะห์หุ้นอเมริกาด้วย AI",
  description: "เว็บวิเคราะห์หุ้นอเมริกา พร้อมกราฟและบทวิเคราะห์จาก AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-bg text-text min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <TickerTape />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 min-h-[70vh]">{children}</main>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
