import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hello.aldenderf.com"),
  title: "Hello",
  description: "Some things are better experienced than explained.",
  alternates: {
    canonical: "https://hello.aldenderf.com",
  },
  openGraph: {
    title: "👋 Hello.",
    description: "Some things are better experienced than explained.",
    url: "https://hello.aldenderf.com",
    siteName: "Hello",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "👋 Hello.",
    description: "Some things are better experienced than explained.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
