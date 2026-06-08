import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, CreditCard
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-50 text-blue-700 shadow-sm font-semibold' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  // Safe parsing fallback from cache to keep layout drawing during async thread lags
  const cachedUserRaw = localStorage.getItem('business_nexus_user');
  const fallbackUser = cachedUserRaw ? JSON.parse(cachedUserRaw) : null;
  const activeUser = user || fallbackUser;
  
  // Dynamic role fallback evaluation
  const activeRole = activeUser?.role ? activeUser.role.toLowerCase() : 'entrepreneur';
  const activeId = activeUser?.id || 'me';
  
  // Define sidebar items based on active role
  const entrepreneurItems = [
    { to: `/dashboard/entrepreneur`, icon: <Home size={20} />, text: 'Dashboard' },
    { to: `/profile/entrepreneur/${activeId}`, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/dashboard/documents', icon: <FileText size={20} />, text: 'Documents' },
    { to: '/dashboard/payments', icon: <CreditCard size={20} />, text: 'Payments' },
  ];
  
  const investorItems = [
    { to: `/dashboard/investor`, icon: <Home size={20} />, text: 'Dashboard' },
    { to: `/profile/investor/${activeId}`, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
    { to: '/dashboard/payments', icon: <CreditCard size={20} />, text: 'Payments' },
  ];
  
  const sidebarItems = activeRole === 'investor' ? investorItems : entrepreneurItems;
  
  // Common items at the bottom
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 hidden md:block sticky top-16 z-30">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </div>
          
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600">Need assistance?</p>
            <h4 className="text-sm font-medium text-gray-900 mt-1">Contact Support</h4>
            <a 
              href="mailto:support@businessnexus.com" 
              className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};