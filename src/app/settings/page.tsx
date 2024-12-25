'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { useStreamingData } from '@/hooks/useStreamingData';

export default function SettingsPage() {
  const router = useRouter();
  const { currentProfile } = useProfiles();
  const { refreshAll, getLastUpdateTime } = useStreamingData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!currentProfile) {
      router.push('/profiles');
    }
  }, [currentProfile, router]);

  useEffect(() => {
    const updateTime = getLastUpdateTime();
    setLastUpdate(updateTime ? new Date(updateTime) : null);
  }, [getLastUpdateTime]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAll();
      const newUpdateTime = getLastUpdateTime();
      setLastUpdate(newUpdateTime ? new Date(newUpdateTime) : null);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cache Management</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Last Update</h3>
                <p className="text-sm text-gray-400">
                  {lastUpdate ? formatDate(lastUpdate) : 'Never updated'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isRefreshing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {isRefreshing ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Refreshing...
                  </div>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Click the refresh button to fetch fresh data from the server. This will update all movies, series, and live TV data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
