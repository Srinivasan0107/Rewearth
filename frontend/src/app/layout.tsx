"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ReWearth — Swap Fashion. Save Money. Reduce Waste.</title>
        <meta name="description" content="Sustainable clothing swap platform" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}

function NavbarWrapper() {
  return <Navbar />;
}
