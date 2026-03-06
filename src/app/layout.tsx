import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noctra Proposals | Dashboard",
  description: "Internal portal for proposal and contract management",
  icons: {
    icon: [
      {
        url: "/favicon-dark.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} antialiased`}>{children}</body>
    </html>
  );
}
