import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Local MoM Generator - Home",
  description: "Generate minutes of meeting from video recordings locally",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} antialiased font-display`}>
        {children}
      </body>
    </html>
  );
}
