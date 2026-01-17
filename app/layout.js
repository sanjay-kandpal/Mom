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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storedTheme = localStorage.getItem("theme");
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = storedTheme || (systemPrefersDark ? "dark" : "light");
                document.documentElement.classList.add(theme);
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.add("light");
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased font-display`}>
        {children}
      </body>
    </html>
  );
}
