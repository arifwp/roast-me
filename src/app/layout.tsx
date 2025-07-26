import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Roast Me 🔥 - Honest Review for Dev Portfolios",
  description:
    "Roast Me 🔥 is your brutally honest AI-powered reviewer for CVs, GitHub, and LinkedIn profiles. Get roasted, get better. Improve your personal branding as a developer.",
  keywords: [
    "Roast Me 🔥",
    "CV review for developers",
    "GitHub profile analysis",
    "LinkedIn developer review",
    "developer portfolio critique",
    "AI resume review",
    "tech resume feedback",
    "brutal CV reviewer",
    "developer personal branding",
    "funny CV analysis",
  ],
  authors: [
    { name: "Arif Wahyu Prasetyo", url: 'https://arifwahyu.id' },
  ],
  creator: "Arif Wahyu Prasetyo",
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_FE_URL}`),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Roast Me 🔥 - Brutal Yet Helpful Dev Portfolio Reviewer",
    description:
      "Submit your CV, GitHub, or LinkedIn and let Roast Me 🔥 deliver an honest, AI-powered critique. Designed to help developers grow with sharp feedback.",
    url: `${process.env.NEXT_PUBLIC_FE_URL}`,
    siteName: "Roast Me 🔥",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_FE_URL}/images/app_logo.png`,
        width: 1200,
        height: 630,
        alt: "Roast Me 🔥 - Developer Portfolio Reviewer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast Me 🔥 - AI Reviewer for Developers",
    description:
      "Get your developer CV, GitHub, and LinkedIn judged by AI. Brutally honest feedback to level up your career — one roast at a time.",
    creator: "@arifwahyuu_",
    images: [`${process.env.NEXT_PUBLIC_FE_URL}/images/app_logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
