import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchNavigation } from "@/lib/strapi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagena - Centrum Zdraví",
  description: "Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.",
  keywords: "zdravotní péče, ordinace, rehabilitace, MRI, lékárna, Sagena",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch navbar navigation from Strapi
  // Fallback to empty array if Strapi is not available (for development)
  let navbarItems = [];
  try {
    navbarItems = await fetchNavigation(true, undefined, 'cs-CZ');
  } catch (error) {
    console.error('Failed to fetch navigation from Strapi:', error);
  }

  return (
    <html lang="cs">
      <body className={`${inter.className} antialiased`}>
        <Header navigation={navbarItems} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
