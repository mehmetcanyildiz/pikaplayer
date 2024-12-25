import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProfileProvider } from '@/contexts/ProfileContext';
import ClientLayout from '@/components/layout/ClientLayout';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PikaPlayer',
  description: 'Modern streaming application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ProfileProvider>
            <ClientLayout>{children}</ClientLayout>
          </ProfileProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
