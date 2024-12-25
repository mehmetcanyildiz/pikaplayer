'use client';

import { useState } from 'react';
import { Profile, ProfileType } from '@/types/profile';
import { useProfiles } from '@/contexts/ProfileContext';

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { addProfile } = useProfiles();
  const [activeTab, setActiveTab] = useState<ProfileType>('xtream');
  const [formData, setFormData] = useState({
    name: '',
    server: '',
    username: '',
    password: '',
    playlistUrl: '',
    macAddress: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseProfile = {
      name: formData.name,
      type: activeTab,
    };

    switch (activeTab) {
      case 'xtream':
        addProfile({
          ...baseProfile,
          type: 'xtream',
          server: formData.server,
          username: formData.username,
          password: formData.password,
        });
        break;
      case 'm3u':
        addProfile({
          ...baseProfile,
          type: 'm3u',
          playlistUrl: formData.playlistUrl,
        });
        break;
      case 'stalker':
        addProfile({
          ...baseProfile,
          type: 'stalker',
          server: formData.server,
          macAddress: formData.macAddress,
        });
        break;
    }

    // Reset form
    setFormData({
      name: '',
      server: '',
      username: '',
      password: '',
      playlistUrl: '',
      macAddress: '',
    });

    // Call success callback if provided
    onSuccess?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-secondary p-6 rounded-lg shadow-lg">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'xtream'
              ? 'bg-primary text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('xtream')}
        >
          Xtream Codes
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'm3u'
              ? 'bg-primary text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('m3u')}
        >
          M3U/M3U8
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'stalker'
              ? 'bg-primary text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('stalker')}
        >
          Stalker Portal
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Profile Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        {activeTab === 'xtream' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Server</label>
              <input
                type="url"
                name="server"
                value={formData.server}
                onChange={handleChange}
                placeholder="http://example.com:8080"
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </>
        )}

        {activeTab === 'm3u' && (
          <div>
            <label className="block text-sm font-medium mb-1">M3U/M3U8 URL</label>
            <input
              type="url"
              name="playlistUrl"
              value={formData.playlistUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        )}

        {activeTab === 'stalker' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Portal URL</label>
              <input
                type="url"
                name="server"
                value={formData.server}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MAC Address</label>
              <input
                type="text"
                name="macAddress"
                value={formData.macAddress}
                onChange={handleChange}
                placeholder="00:1A:79:XX:XX:XX"
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
