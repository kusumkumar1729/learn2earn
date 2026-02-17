import React from 'react';
import type { Metadata, Viewport } from 'next';
import './styles/index.css';
import Providers from '@/components/Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Learn2Earn - Transform Education into Cryptocurrency Rewards',
  description: 'Learn2Earn is a blockchain-powered education platform where you earn cryptocurrency rewards while building valuable skills.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
