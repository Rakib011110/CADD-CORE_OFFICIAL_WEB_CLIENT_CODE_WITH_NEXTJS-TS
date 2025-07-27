import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    "Join CADD CORE – Bangladesh's leading training institute for AutoCAD, Civil Engineering, Architecture, and IT skills. Learn from industry experts through practical, job-ready courses. International certification, real-world projects, and career-focused education.",

  keywords: [
    "AutoCAD Training Bangladesh",
    "autocad training course",
    "Civil Engineering Courses Bangladesh",
    "IT Training Institute Dhaka",
    "Architecture Training Bangladesh",
    "Professional IT Certification Bangladesh",
    "Job-ready IT Skills Bangladesh",
    "Engineering Software Training Bangladesh",
    "International Certification Bangladesh",
    "Best IT Institute Bangladesh",
    "Practical IT Courses Bangladesh",
    "CADD Training Bangladesh",
    "Computer Training Center Bangladesh",
    "Software Training Institute Bangladesh",
    "CAD Design Courses Bangladesh",
    "Engineering Career Bangladesh",
    "Technical Training Bangladesh",
    "Graphic Design Training Bangladesh",
    "Web Development Course Bangladesh",
    "Microsoft Office Training Bangladesh",
    "Revit Training Bangladesh",
    // New keywords added below
    "AutoCAD training center in dhaka",
    "autocad course in dhaka",
    "Revit training course",
    "autocad course in bd",
    "autocad course with certificate",
    "autocad courses for beginners in bd",
    "autocad training course online",
    "free autocad courses for beginners",
    "online autocad courses for beginners",
    "free online autocad course with certificate",
    "autocad course fees",
    "Advanced AutoCAD training center in dhaka",
    "Advanced autocad course in dhaka",
    "Advanced autocad training course",
    "Advanced autocad full course",
    "Advanced autocad course in bd",
  ],

  openGraph: {
    title: "CADD CORE IT | Professional IT Training Institute in Bangladesh",
    description:
      "Transform your career with CADD CORE's expert-led AutoCAD, Civil Engineering, and IT training. Real-world projects, international certifications, and job-ready skills.",
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
    images: [
      "https://res.cloudinary.com/dbkwiwoll/image/upload/v1747304781/CADDCORE-Profile-Background_hcnox7.jpg",
    ],
  },
  metadataBase: new URL("https://www.caddcore.net"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap"
          rel="stylesheet"
        />
        {/* Facebook Pixel Meta Tag */}
        <meta property="fb:pixel_id" content="408403910510266" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Facebook Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              fbq('init', '408403910510266');
              fbq('track', 'PageView');
              
              // Enable Advanced Matching (optional - improves conversion tracking)
              fbq('init', '408403910510266', {
                em: 'auto', // Email hashing
                fn: 'auto', // First name hashing  
                ln: 'auto', // Last name hashing
                ph: 'auto', // Phone hashing
                ct: 'auto', // City hashing
                st: 'auto', // State hashing
                zp: 'auto'  // Zip code hashing
              });
            `,
          }}
        />
        
        {/* Facebook Pixel NoScript (for users with JavaScript disabled) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=408403910510266&ev=PageView&noscript=1"
          />
        </noscript>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}