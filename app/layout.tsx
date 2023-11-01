import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";

// const font = Figtree({ subsets: ['latin'] })
export const dynamic = 'force-dynamic';
// export const revalidate = 0;
export const metadata = {
  title: "CallSmart",
  description: "Your all in one solution for handling missed calls",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          "h-[100dvh] bg-gradient-to-b from-white to-prim-blue/10 bg-white overflow-hidden"
        }
      >
        <div className="flex flex-col h-[100dvh] overflow-scroll">
          <SupabaseProvider>
            <UserProvider>{children}</UserProvider>
          </SupabaseProvider>
        </div>
      </body>
    </html>
  );
}
