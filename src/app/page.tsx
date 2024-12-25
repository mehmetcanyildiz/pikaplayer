'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import ProfileSelector from '@/components/profile/ProfileSelector';

export default function Home() {
  const { currentProfile } = useProfiles();
  const router = useRouter();

  useEffect(() => {
    if (currentProfile) {
      router.push('/live');
    }
  }, [currentProfile, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to PikaPlayer</h1>
        <ProfileSelector />
      </div>
    </main>
  );
}
