import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AudioPlayerProvider } from "@/components/AudioPlayerContext";
import MiniPlayer from "@/components/MiniPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Justin JesKØ",
  description: "Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=gambetta@1,2&f[]=general-sans@1,2&f[]=satoshi@1,2&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <AudioPlayerProvider>
          {children}
          <MiniPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
