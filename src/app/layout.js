import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AuthProvidor from "@/components/AuthProvidor";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Usersbay",
  description: "Connecting users together",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvidor session={session}>

          <Navbar />
          {children}
          <Toaster position="top-center" richColors/>
          
        </AuthProvidor>
      </body>
    </html>
  );
}
