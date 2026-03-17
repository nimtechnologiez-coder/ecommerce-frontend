import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PHAMON Vendor Panel",
  description: "Vendor dashboard for PHAMON Automotives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 lg:ml-72 pt-16 lg:pt-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
