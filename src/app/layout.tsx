import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Article Writer",
  description: "Write articles with ease",
};

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
        "bg-black text-white min-h-screen",
          poppins.className,
        )}
      >
        <Providers>
          <Navbar/>
          {children}
          <ToastContainer />
          </Providers>
      </body>
    </html>
  );
}
