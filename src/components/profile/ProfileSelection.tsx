import { useState } from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import { Profile } from '@/types/profile';

const ProfileSelection = () => {
  const { profiles, currentProfile, setCurrentProfile, deleteProfile, updateProfile } = useProfiles();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const handleProfileClick = (profile: Profile) => {
    setCurrentProfile(profile.id);
  };

  const handleEditClick = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const handleDeleteClick = (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(profileId);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className={`relative group p-4 rounded-lg ${
            currentProfile?.id === profile.id
              ? 'bg-primary'
              : 'bg-secondary hover:bg-gray-700'
          } cursor-pointer transition-colors`}
          onClick={() => handleProfileClick(profile)}
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-3xl">{profile.name[0].toUpperCase()}</span>
            </div>
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{profile.type}</p>
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(profile);
              }}
              className="p-1 hover:text-primary"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(profile.id);
              }}
              className="p-1 hover:text-red-500"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileSelection;
