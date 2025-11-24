import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagena - Centrum Zdraví",
  description: "Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.",
  keywords: "zdravotní péče, ordinace, rehabilitace, MRI, lékárna, Sagena",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale?: string;
  }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const htmlLang = locale || 'cs';

  return (
    <html lang={htmlLang}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
