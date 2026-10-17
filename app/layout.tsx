import type { Metadata } from "next";
import { Bowlby_One, Figtree } from "next/font/google";
import "./globals.css";

const bowlbyOne = Bowlby_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineGalería",
  description: "Explora películas y series populares con pósters, calificaciones y sinopsis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${bowlbyOne.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-noche font-sans text-lavanda">
        {children}
      </body>
    </html>
  );
}
