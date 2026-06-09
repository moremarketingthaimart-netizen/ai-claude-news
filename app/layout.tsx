import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude News — AI & Tech Briefing",
  description: "AI-powered news aggregator for Tech and AI, updated daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xs font-black tracking-widest uppercase text-sky-400">AI</span>
              <span className="w-px h-3.5 bg-border/60" />
              <span className="text-sm font-semibold tracking-tight">Claude News</span>
            </Link>
            <nav className="flex items-center gap-0.5 text-xs font-medium">
              <Link href="/" className="px-3 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                Feed
              </Link>
              <Link href="/digest" className="px-3 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                Digest
              </Link>
              <Link href="/trends" className="px-3 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                Trends
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-border/40 mt-20">
          <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground/50">
            <span className="font-black tracking-widest uppercase text-sky-400/50">Claude News</span>
            <span>Extractive · Supabase · Next.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
