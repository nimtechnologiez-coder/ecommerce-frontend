import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "PHAMON Automotives | Uganda's Premier Auto Marketplace",
  description: "Buy and sell automotive parts, accessories, and vehicles in Uganda. Multi-vendor marketplace with Mobile Money payments.",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
