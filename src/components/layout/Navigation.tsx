'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  PlayIcon,
  FilmIcon,
  TvIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useProfiles } from '@/contexts/ProfileContext';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Live TV', href: '/live', icon: PlayIcon },
  { name: 'Movies', href: '/movies', icon: FilmIcon },
  { name: 'Series', href: '/series', icon: TvIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const { currentProfile } = useProfiles();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <Disclosure as="nav" className="bg-black/90 backdrop-blur-sm fixed w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold text-red-600">PIKA</span>
                    <span className="text-2xl font-bold text-white">PLAYER</span>
                  </Link>
                </div>

                {/* Main Navigation */}
                <div className="hidden md:ml-6 md:flex md:space-x-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={currentProfile ? item.href : '/profiles'}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200
                          ${isActive 
                            ? 'text-white' 
                            : 'text-gray-300 hover:text-white'
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  {isSearchOpen ? (
                    <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Titles, people, genres"
                        className="w-64 px-4 py-1 pl-10 text-sm text-white bg-black border border-gray-600 rounded-full focus:outline-none focus:border-white"
                        autoFocus
                      />
                      <MagnifyingGlassIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center text-gray-300 hover:text-white">
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profiles"
                            className={`
                              block px-4 py-2 text-sm
                              ${active ? 'bg-gray-900 text-white' : 'text-gray-300'}
                            `}
                          >
                            Switch Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={`
                              block px-4 py-2 text-sm
                              ${active ? 'bg-gray-900 text-white' : 'text-gray-300'}
                            `}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={currentProfile ? item.href : '/profiles'}
                    className={`
                      flex items-center rounded-md px-3 py-2 text-base font-medium
                      ${isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
