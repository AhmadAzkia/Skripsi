import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-white">
            <main className="grow">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
