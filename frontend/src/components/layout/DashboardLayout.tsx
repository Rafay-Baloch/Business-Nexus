import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Handled production storage key match footprint correctly
  const token = localStorage.getItem('business_nexus_token') || localStorage.getItem('token');
  const localUserJson = localStorage.getItem('business_nexus_user');
  
  // Local state to forcefully clear blocking states on slower engine responses
  const [forceHydrate, setForceHydrate] = useState<boolean>(true);

  useEffect(() => {
    // 1.5 seconds maximum safeguard fallback timer to destroy stuck spinners
    const safetyTimer = setTimeout(() => {
      setForceHydrate(false);
    }, 1500);

    return () => clearTimeout(safetyTimer);
  }, []);

  // 1. Loading State Check
  if (isLoading && forceHydrate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // 2. Loose Guard Fallback - checking local tracking artifacts alongside context states
  if (!isAuthenticated && !token && !localUserJson && !forceHydrate) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Fallback destroyed - if context state is setting up but local cache is present, bypass directly!
  if (!user && !localUserJson && forceHydrate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Syncing secure profile stream...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};