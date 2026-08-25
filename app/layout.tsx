import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { LocaleProvider } from '@/components/locale-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: 'NFT Real Estate — Saudi Arabia Next-Gen Real Estate Platform',
  description:
    'Discover luxury villas, apartments, lands, and commercial properties across Saudi Arabia with NFT Real Estate. Next-generation real estate marketplace for Riyadh, Jeddah, Makkah, and all major cities.',
  keywords: [
    'NFT Real Estate',
    'NFT العقارية',
    'Saudi Arabia real estate',
    'Riyadh properties',
    'Jeddah properties',
    'Saudi real estate marketplace',
    'KSA property listings',
    'villas for sale Saudi Arabia',
    'apartments for rent Riyadh',
  ],
  openGraph: {
    title: 'NFT Real Estate — Saudi Arabia Next-Gen Real Estate Platform',
    description:
      'Find your perfect property in Saudi Arabia. Browse premium properties across all major Saudi cities.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFT Real Estate — Saudi Arabia Next-Gen Real Estate Platform',
    description:
      'Find your perfect property in Saudi Arabia. Browse premium properties across all major Saudi cities.',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'ar': '/',
    },
  },
  metadataBase: new URL('https://nftrealestate.sa'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <LocaleProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LocaleProvider>
      </body>
    </html>
  );
}
