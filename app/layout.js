import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import { ThemeProvider } from "next-themes";
import { CartDrawer } from "@/components/cart-drawer"
import Header from "@/components/header"
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HeyChief Caps",
  description: "U.S Navy inspired hats and merch",
  generator: "Hey Chief Official",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Suspense fallback={null /* or a small skeleton header */}>
              <Header />
            </Suspense>
              {children}
            <CartDrawer />
          </ThemeProvider>
        </CartProvider> 
      </body>
    </html>
  );
}
