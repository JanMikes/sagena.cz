import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagena - Centrum Zdraví",
  description: "Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.",
  keywords: "zdravotní péče, ordinace, rehabilitace, MRI, lékárna, Sagena",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
