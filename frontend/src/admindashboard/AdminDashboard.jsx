import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminLoginPage from './AdminLoginPage';
import { checkAdminSession, logoutAdmin } from '../lib/authApi';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Check existing session on load
  useEffect(() => {
    let isMounted = true;

    async function verify() {
      try {
        const session = await checkAdminSession();
        if (isMounted) {
          if (session.authenticated && session.admin) {
            setAdmin(session.admin);
          } else {
            setAdmin(null);
          }
        }
      } catch (err) {
        if (isMounted) setAdmin(null);
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    }

    verify();

    const handleLoggedOut = () => {
      setAdmin(null);
    };
    window.addEventListener('tts-admin-logged-out', handleLoggedOut);

    return () => {
      isMounted = false;
      window.removeEventListener('tts-admin-logged-out', handleLoggedOut);
    };
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  // Sleek security verification splash
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#E5383B]/20 border border-[#E5383B]/40 flex items-center justify-center mb-4 shadow-xl shadow-[#E5383B]/10">
          <ShieldCheck className="w-7 h-7 text-[#FFD700] animate-pulse" />
        </div>
        <div className="w-5 h-5 border-2 border-[#E5383B] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-outfit font-bold text-sm text-neutral-300">
          Checking Security Clearance...
        </p>
        <span className="text-[11px] text-neutral-500 font-mono mt-1">
          TrekToShikhar Founder Vault
        </span>
      </div>
    );
  }

  // If not authenticated -> Show Secret Login Portal
  if (!admin) {
    return <AdminLoginPage onLoginSuccess={(user) => setAdmin(user)} />;
  }

  // Authenticated Founder -> Render Admin CRM
  return <AdminLayout admin={admin} onLogout={handleLogout} />;
}
