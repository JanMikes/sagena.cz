import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchNavigation } from "@/lib/strapi";
import type { NavigationItem } from "@/types/strapi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagena - Centrum Zdraví",
  description: "Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.",
  keywords: "zdravotní péče, ordinace, rehabilitace, MRI, lékárna, Sagena",
};

/**
 * Force dynamic rendering for all pages
 * This prevents build-time pre-rendering when Strapi is not available
 */
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch navbar navigation from Strapi
  // Fallback to empty array if Strapi is not available (for development)
  let navbarItems: NavigationItem[] = [];
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
