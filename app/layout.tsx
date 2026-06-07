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
  title: "ai-claude-news — AI & Tech News",
  description: "AI-powered news aggregator สรุปข่าว Tech/AI ด้วย Claude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              🗞️ ai-claude-news
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Feed</Link>
              <Link href="/digest" className="hover:text-foreground transition-colors">Digest</Link>
              <Link href="/trends" className="hover:text-foreground transition-colors">Trends</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted-foreground text-center">
            Powered by <span className="text-foreground">Claude Sonnet</span> · Supabase · Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
