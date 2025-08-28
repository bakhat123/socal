import { Inter, Playfair_Display } from 'next/font/google'
import type { Metadata } from 'next'
import '../globals.css'
import '../../styles/custom.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AdminAwareLayout from '@/components/layout/AdminAwareLayout';
import { Toaster } from 'sonner';

const locales = ['en', 'de','fr','zh','ar','es'];
//comment
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://socalprimehomes.com'),
  title: {
    default: 'SoCal Prime Homes',
    template: '%s | SoCal Prime Homes',
  },
  description: 'Luxury real estate expertise across Southern California. Buy, sell, or invest with SoCal Prime Homes.',
  openGraph: {
    siteName: 'SoCal Prime Homes',
    type: 'website',
    title: 'SoCal Prime Homes',
    description: 'Luxury real estate expertise across Southern California.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoCal Prime Homes',
    description: 'Luxury real estate expertise across Southern California.'
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as string)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="application-name" content="SoCal Prime Homes" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-title" content="SoCal Prime Homes" />
        <meta property="og:site_name" content="SoCal Prime Homes" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/logo.png" />
      </head>
      <body className="font-sans bg-white text-charcoal">
        <NextIntlClientProvider messages={messages}>
          <AdminAwareLayout>{children}</AdminAwareLayout>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}