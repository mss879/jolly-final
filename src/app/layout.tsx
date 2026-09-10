import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jollyscreamery.com"),
  title: {
    default: "Jolly's Creamery — Ice Cream Carts for Weddings & Events in Sri Lanka",
    template: "%s · Jolly's Creamery",
  },
  description:
    "Luxury ice cream carts with a live host for weddings, corporate events and parties across Sri Lanka. Found at Shangri-La and Hilton Colombo. You're about to feel good.",
  openGraph: {
    title: "Jolly's Creamery — You're about to feel good",
    description:
      "Elegant décor, live scoops, joyful memories — ice cream carts for weddings, corporate events and private parties across Sri Lanka.",
    type: "website",
    images: ["/images/carts/cart-lobby-cream.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Preloader />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
