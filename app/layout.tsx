import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Modalin — Modal Tumbuh, Akses Terbuka",
    template: "%s · Modalin",
  },
  description:
    "Equity crowdfunding pertama Indonesia yang terintegrasi dengan rekening bank UMKM. Investasi mulai Rp100.000.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
