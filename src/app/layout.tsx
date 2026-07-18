import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArcWay - Stablecoin Payment App on Arc Network',
  description: 'Send, bridge, and swap USDC across chains with Circle App Kit SDK on Arc Network Testnet',
  keywords: ['Arc Network', 'USDC', 'Circle', 'App Kit', 'CCTP', 'stablecoin', 'bridge', 'swap', 'payment', 'web3'],
  authors: [{ name: 'ArcWay Team' }],
  creator: 'ArcWay',
  publisher: 'ArcWay',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arcway.xyz',
    title: 'ArcWay - Stablecoin Payment App',
    description: 'Send, bridge, and swap USDC across chains with Circle App Kit SDK',
    siteName: 'ArcWay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcWay - Stablecoin Payment App',
    description: 'Send, bridge, and swap USDC across chains with Circle App Kit SDK',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}