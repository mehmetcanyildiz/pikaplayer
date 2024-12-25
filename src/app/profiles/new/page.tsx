'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/contexts/ProfileContext';

export default function NewProfilePage() {
  const router = useRouter();
  const { addProfile } = useProfiles();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      if (!name || !url || !username || !password) {
        throw new Error('All fields are required');
      }

      // Remove any trailing slashes from the URL
      const cleanUrl = url.trim().replace(/\/$/, '');

      await addProfile({
        id: crypto.randomUUID(),
        type: 'xtream',
        name: name.trim(),
        url: cleanUrl,
        username: username.trim(),
        password: password.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.push('/profiles');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Create New Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Profile Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 bg-secondary rounded focus:ring-2 focus:ring-primary"
              placeholder="My Profile"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Server URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              className="w-full px-4 py-2 bg-secondary rounded focus:ring-2 focus:ring-primary"
              placeholder="example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 bg-secondary rounded focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 bg-secondary rounded focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
