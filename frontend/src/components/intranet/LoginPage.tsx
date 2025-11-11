'use client';

import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginPageProps {
  onLogin?: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(username, password);
    } else {
      console.log('Login:', { username, password });
      alert('Přihlášení proběhlo úspěšně (mockup)');
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Intranet Sagena
          </h2>
          <p className="text-gray-600">Přihlaste se do svého účtu</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Uživatelské jméno
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="vas.email@sagena.cz"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Heslo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Zapamatovat si mě
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Zapomenuté heslo?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Přihlásit se
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Potřebujete přístup?{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Kontaktujte IT podporu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
