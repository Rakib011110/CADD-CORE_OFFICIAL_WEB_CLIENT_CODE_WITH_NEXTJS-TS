import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import { Providers } from "@/lib/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CADD CORE IT | Professional IT Training Institute in Bangladesh",
  description:
    "Join CADD CORE – Bangladesh’s leading training institute for AutoCAD, Civil Engineering, Architecture, and IT skills. Learn from industry experts through practical, job-ready courses. International certification, real-world projects, and career-focused education.",
  openGraph: {
    title: "CADD CORE IT | Professional IT Training Institute in Bangladesh",
    description:
      "Transform your career with CADD CORE’s expert-led AutoCAD, Civil Engineering, and IT training. Real-world projects, international certifications, and job-ready skills.",
    url: "https://www.caddcore.net",
    siteName: "CADD CORE",
    images: [
      {
        url: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1747304781/CADDCORE-Profile-Background_hcnox7.jpg",
        width: 1200,
        height: 630,
        alt: "CADD CORE Training Institute Bangladesh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CADD CORE | Best Engineering, AutoCAD & IT Training in Bangladesh",
    description:
      "CADD CORE offers hands-on training in AutoCAD, Civil Engineering, Architecture, and IT with expert certification and job-focused learning.",
    site: "@caddcore",
    images: ["https://res.cloudinary.com/dbkwiwoll/image/upload/v1747304781/CADDCORE-Profile-Background_hcnox7.jpg"],
  },
  metadataBase: new URL("https://www.caddcore.net"),
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" >
    <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap"
        rel="stylesheet"
      />
    </head>
    <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers >
        {children}
      </Providers>
    </body>
  </html>
  );
}
