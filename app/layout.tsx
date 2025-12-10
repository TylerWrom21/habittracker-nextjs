import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toast } from "@/components/atoms/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ 
  variable: "--font-inter",
  subsets: ['latin'],
  weight: ['400', '700'],
});

const spaceGrotesk = Space_Grotesk({ 
  variable: "--font-inter",
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "Track your habits with clarity and consistency."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} antialiased bg-background font-sans ${spaceGrotesk.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toast />
        </ThemeProvider>
      </body>
    </html>
  );
}
