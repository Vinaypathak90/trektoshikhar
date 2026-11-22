import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLoginPage from './AdminLoginPage';
import NotFoundPage from '../components/NotFoundPage';
import { checkAdminSession, logoutAdmin } from '../lib/authApi';
import { ShieldCheck } from 'lucide-react';

const SECRET_PATH = (import.meta.env.VITE_ADMIN_SECRET_PATH || '/shikhar-vault-772').toLowerCase();

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Check whether the visitor arrived via the Secret URL or has an access key
  const currentPath = location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(location.search);
  const hasAccessKey = searchParams.get('vault') === '772' || searchParams.get('access') === 'founder';
  const isSecretRoute = currentPath.startsWith(SECRET_PATH) || currentPath.startsWith('/shikhar-vault') || hasAccessKey;

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
    navigate('/');
  };

  // 1. Sleek verification splash
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-4 select-none">
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

  // 2. If NOT authenticated:
  if (!admin) {
    // If the visitor hit public /admin directly without knowing the secret route:
    // HIDE IT COMPLETELY! Show 404 Not Found so bots/strangers find nothing!
    if (!isSecretRoute) {
      return (
        <NotFoundPage 
          title="Trail Coordinates Not Found" 
          message="No sanctuary route, public itinerary, or administrative trail exists at this path." 
        />
      );
    }

    // Visitor arrived via the secret route (e.g. /shikhar-vault-772) -> Show Founder Security Gate
    return <AdminLoginPage onLoginSuccess={(user) => setAdmin(user)} />;
  }

  // 3. Authenticated Founder (Vinay / Kunal) -> Render Admin CRM
  return <AdminLayout admin={admin} onLogout={handleLogout} />;
}
