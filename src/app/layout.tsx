import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "hello.",
  description: "Something slightly unnecessary is being built here.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
