import type { Metadata } from "next";
import { Space_Grotesk } from 'next/font/google';

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toast } from "@/components/atoms/toast";

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
        className={`${spaceGrotesk.variable} antialiased bg-background font-sans ${spaceGrotesk.className}`}
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
