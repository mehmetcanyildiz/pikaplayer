'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import { SearchProvider } from '@/contexts/SearchContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavigation = pathname !== '/';

  return (
    <SearchProvider>
      <FavoritesProvider>
        {showNavigation && <Navigation />}
        <main className={showNavigation ? 'pt-16' : ''}>{children}</main>
      </FavoritesProvider>
    </SearchProvider>
  );
}
