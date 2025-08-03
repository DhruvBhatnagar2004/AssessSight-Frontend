"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Header({ onScan, onScanStart, onScanError }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    // Add protocol if missing
    let scanUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      scanUrl = `https://${url}`;
    }
    
    setLoading(true);
    onScanStart();
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${backendUrl}/api/scan`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: scanUrl }),
      });

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }

      const result = await response.json();
      onScan(result);
    } catch (error) {
      console.error("Scan failed:", error);
      onScanError(error instanceof Error ? error.message : "Failed to scan website");
    } finally {
      setLoading(false);
    }
  };

  const openLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              Accessibility Analyzer
            </h1>
          </div>
        </div>
        
        <form onSubmit={handleScan} className="flex w-full md:w-auto">
          <div className="flex w-full md:w-auto relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="px-4 py-3 rounded-l bg-slate-700/80 border border-slate-600 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full md:w-80 transition-all duration-150"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-r font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </div>
              ) : "Scan"}
            </button>
            
            {/* Glow effect on focus */}
            <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-focus-within:opacity-100 bg-teal-500/20 blur-xl -z-10"></div>
          </div>
        </form>
        
        <div className="flex items-center mt-4 md:mt-0 md:ml-4">
          {isAuthenticated ? (
            <div className="relative group">
              <button 
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg transition-colors"
              >
                <span>{user?.name || 'User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-x-2">
              <button
                onClick={openLoginModal}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={openRegisterModal}
      />
      
      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={openLoginModal}
      />
    </header>
  );
}
