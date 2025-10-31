'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react';

interface IntranetNavProps {
  userName?: string;
  activeItem?: string;
}

const IntranetNav: React.FC<IntranetNavProps> = ({
  userName = 'Jan Novák',
  activeItem = 'dashboard',
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { id: 'calendar', label: 'Kalendář', icon: Calendar, href: '#' },
    { id: 'documents', label: 'Dokumenty', icon: FileText, href: '#' },
    { id: 'colleagues', label: 'Kolegové', icon: Users, href: '#' },
    { id: 'settings', label: 'Nastavení', icon: Settings, href: '#' },
  ];

  return (
    <div className="bg-primary-700 text-white shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-14">
          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.id === activeItem;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-primary-100 hover:text-white hover:bg-primary-600 rounded-lg transition-colors relative"
              aria-label="Oznámení"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-primary-600">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-primary-200">Lékař</p>
              </div>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
            </div>

            <button
              className="p-2 text-primary-100 hover:text-white hover:bg-primary-600 rounded-lg transition-colors"
              aria-label="Odhlásit se"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden py-2 border-t border-primary-600">
          <div className="flex justify-around">
            {navItems.slice(0, 4).map((item) => {
              const IconComponent = item.icon;
              const isActive = item.id === activeItem;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-primary-200 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default IntranetNav;
