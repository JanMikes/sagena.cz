import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sagena - Centrum Zdraví",
  description: "Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.",
  keywords: "zdravotní péče, ordinace, rehabilitace, MRI, lékárna, Sagena",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-36x36.png", sizes: "36x36", type: "image/png" },
      { url: "/android-chrome-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/android-chrome-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
    ],
  },
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
        <NextTopLoader
          color="#005086"
          height={3}
          showSpinner={false}
          shadow="0 0 10px rgba(0, 80, 134, 0.2), 0 0 5px rgba(0, 80, 134, 0.1)"
        />
        {children}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-T35VZXSZG6"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-T35VZXSZG6');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
