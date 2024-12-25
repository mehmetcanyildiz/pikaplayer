'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, currentProfile, setCurrentProfile, deleteProfile } = useProfiles();

  useEffect(() => {
    // If there are no profiles, redirect to new profile page
    if (profiles.length === 0) {
      router.push('/profiles/new');
    }
  }, [profiles, router]);

  const handleProfileSelect = (profile: any) => {
    setCurrentProfile(profile);
  };

  const handleDeleteProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Select Profile</h1>
          <p className="mt-2 text-gray-400">Choose a profile to start streaming</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={`relative p-4 rounded-lg cursor-pointer transition-all ${
                currentProfile?.id === profile.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-2xl">{profile.name[0].toUpperCase()}</span>
                </div>
                <h3 className="font-medium truncate">{profile.name}</h3>
                <p className="text-sm text-gray-400 truncate">{profile.url}</p>
              </div>
              <button
                onClick={(e) => handleDeleteProfile(e, profile.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div
            onClick={() => router.push('/profiles/new')}
            className="p-4 rounded-lg cursor-pointer bg-secondary hover:bg-gray-700 transition-all flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-600 flex items-center justify-center">
              <PlusIcon className="w-10 h-10" />
            </div>
            <h3 className="font-medium">Add Profile</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
