"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-slate-800/90 backdrop-blur border-b border-slate-700 mb-8">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap">
          <Link 
            href="/" 
            className={`py-3 px-5 font-medium border-b-2 transition-colors ${
              pathname === '/' 
                ? 'border-teal-500 text-teal-400' 
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            Dashboard
          </Link>
          
          {isAuthenticated && (
            <Link 
              href="/history" 
              className={`py-3 px-5 font-medium border-b-2 transition-colors ${
                pathname === '/history' 
                  ? 'border-teal-500 text-teal-400' 
                  : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              My History
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}