'use client';

import { useState } from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import Link from 'next/link';
import { Profile } from '@/types/profile';

export default function ProfileSelector() {
  const { profiles, setCurrentProfile } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setCurrentProfile(profile);
  };

  return (
    <div>
      {profiles.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className={`p-4 rounded-lg transition-all ${
                  selectedProfile?.id === profile.id
                    ? 'bg-primary text-white'
                    : 'bg-secondary hover:bg-gray-700'
                }`}
              >
                <div className="aspect-square rounded-full bg-gray-700 mb-2 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-center font-medium truncate">{profile.name}</p>
              </button>
            ))}

            <Link
              href="/profiles/new"
              className="p-4 rounded-lg bg-secondary hover:bg-gray-700 transition-all flex flex-col items-center justify-center"
            >
              <div className="aspect-square rounded-full bg-gray-700 mb-2 flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
              <p className="text-center font-medium">Add Profile</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-8">
            Get started by creating your first profile
          </p>
          <Link
            href="/profiles/new"
            className="inline-block bg-primary text-white py-3 px-8 rounded-lg hover:bg-red-700 transition-colors"
          >
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
}
