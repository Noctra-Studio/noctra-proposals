import { Playfair_Display, Inter } from "next/font/google";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#FAFAF8] text-[#0A0A0A]`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .font-serif { font-family: var(--font-playfair), serif !important; }
        .font-sans { font-family: var(--font-inter), sans-serif !important; }
      `,
        }}
      />
      <div className="font-sans">{children}</div>
    </div>
  );
}
