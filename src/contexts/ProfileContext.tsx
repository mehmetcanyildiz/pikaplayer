'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Profile } from '@/types/profile';
import { useRouter } from 'next/navigation';

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (profileId: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const router = useRouter();

  // Load profiles and current profile from localStorage
  useEffect(() => {
    const loadProfiles = () => {
      try {
        const storedProfiles = localStorage.getItem('profiles');
        console.log('Stored profiles:', storedProfiles);
        
        if (storedProfiles) {
          const parsedProfiles = JSON.parse(storedProfiles);
          console.log('Parsed profiles:', parsedProfiles);
          
          // Ensure all profiles have the correct type and required fields
          const validProfiles = parsedProfiles.map((profile: any) => ({
            id: profile.id,
            name: profile.name,
            type: 'xtream',
            url: profile.url,
            username: profile.username,
            password: profile.password,
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: profile.updatedAt || new Date().toISOString()
          }));
          
          console.log('Valid profiles:', validProfiles);
          setProfiles(validProfiles);
        }

        const storedCurrentProfile = localStorage.getItem('currentProfile');
        console.log('Stored current profile:', storedCurrentProfile);
        
        if (storedCurrentProfile) {
          const parsedProfile = JSON.parse(storedCurrentProfile);
          console.log('Parsed current profile:', parsedProfile);
          
          // Ensure current profile has the correct type and required fields
          const validProfile = {
            id: parsedProfile.id,
            name: parsedProfile.name,
            type: 'xtream',
            url: parsedProfile.url,
            username: parsedProfile.username,
            password: parsedProfile.password,
            createdAt: parsedProfile.createdAt || new Date().toISOString(),
            updatedAt: parsedProfile.updatedAt || new Date().toISOString()
          };
          
          console.log('Valid current profile:', validProfile);
          setCurrentProfile(validProfile);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    };

    loadProfiles();
  }, []);

  const handleSetCurrentProfile = (profile: Profile | null) => {
    if (profile) {
      // Ensure type is set when setting current profile
      const validProfile = {
        id: profile.id,
        name: profile.name,
        type: 'xtream',
        url: profile.url,
        username: profile.username,
        password: profile.password,
        createdAt: profile.createdAt || new Date().toISOString(),
        updatedAt: profile.updatedAt || new Date().toISOString()
      };
      
      console.log('Setting current profile:', validProfile);
      setCurrentProfile(validProfile);
      localStorage.setItem('currentProfile', JSON.stringify(validProfile));
      router.push('/live');
    } else {
      setCurrentProfile(null);
      localStorage.removeItem('currentProfile');
      router.push('/');
    }
  };

  const addProfile = (profile: Profile) => {
    // Ensure type is set when adding a profile
    const validProfile = {
      id: profile.id,
      name: profile.name,
      type: 'xtream',
      url: profile.url,
      username: profile.username,
      password: profile.password,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: profile.updatedAt || new Date().toISOString()
    };
    
    console.log('Adding profile:', validProfile);
    const newProfiles = [...profiles, validProfile];
    setProfiles(newProfiles);
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    handleSetCurrentProfile(validProfile);
  };

  const updateProfile = (profile: Profile) => {
    // Ensure type is set when updating a profile
    const validProfile = {
      id: profile.id,
      name: profile.name,
      type: 'xtream',
      url: profile.url,
      username: profile.username,
      password: profile.password,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating profile:', validProfile);
    const newProfiles = profiles.map((p) =>
      p.id === profile.id ? validProfile : p
    );
    setProfiles(newProfiles);
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    if (currentProfile?.id === profile.id) {
      handleSetCurrentProfile(validProfile);
    }
  };

  const deleteProfile = (profileId: string) => {
    console.log('Deleting profile:', profileId);
    const newProfiles = profiles.filter((p) => p.id !== profileId);
    setProfiles(newProfiles);
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    if (currentProfile?.id === profileId) {
      handleSetCurrentProfile(null);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile: handleSetCurrentProfile,
        addProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
}
