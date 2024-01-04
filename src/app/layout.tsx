import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "../components/ConvexClientProvider";
import SidenavHeader from "@/components/sidenavHeader";
import { useUser } from "@clerk/clerk-react";
import { SearchProvider } from "@/utilities/SearchContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klick",
  description: "Next gen simple test management tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <ClerkProvider>
        <ConvexClientProvider>
          <SearchProvider>
            <body className={`${inter.className} h-full`}>
              <SidenavHeader>{children}</SidenavHeader>
            </body>
          </SearchProvider>
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
