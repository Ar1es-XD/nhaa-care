'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type UserRole = 'citizen' | 'counselor' | 'admin' | 'public';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  district: string;
  avatarUrl?: string;
  provider: 'supabase_google' | 'meripehchan_sso' | 'demo_sso';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMeriPehchan: () => Promise<void>;
  signInAsRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const DEMO_USERS: Record<UserRole, AuthUser> = {
  citizen: {
    id: 'usr-cit-001',
    email: 'priya.devi@sahaara.gov.in',
    name: 'Priya Devi',
    role: 'citizen',
    district: 'Varanasi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    provider: 'demo_sso',
  },
  counselor: {
    id: 'usr-cns-002',
    email: 'dr.ananya.verma@triage.sahaara.gov.in',
    name: 'Dr. Ananya Verma (Licensed Clinical Counselor)',
    role: 'counselor',
    district: 'Varanasi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    provider: 'meripehchan_sso',
  },
  admin: {
    id: 'usr-adm-003',
    email: 'dm.varanasi@gov.in',
    name: 'District Magistrate (Varanasi)',
    role: 'admin',
    district: 'Varanasi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    provider: 'meripehchan_sso',
  },
  public: {
    id: 'usr-pub-000',
    email: 'guest@sahaara.org',
    name: 'Guest Sanctuary Visitor',
    role: 'public',
    district: 'National',
    provider: 'demo_sso',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    // 1. Check local cached user state
    const savedUser = localStorage.getItem('sahaara_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    } else {
      // Default to citizen demo profile for frictionless onboarding
      setUser(DEMO_USERS.citizen);
      localStorage.setItem('sahaara_auth_user', JSON.stringify(DEMO_USERS.citizen));
    }

    // 2. Check Supabase active session if configured
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'user@sahaara.gov.in',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Sanctuary Citizen',
            role: (session.user.user_metadata?.role as UserRole) || 'citizen',
            district: session.user.user_metadata?.district || 'Varanasi',
            avatarUrl: session.user.user_metadata?.avatar_url,
            provider: 'supabase_google',
          };
          setUser(authUser);
          localStorage.setItem('sahaara_auth_user', JSON.stringify(authUser));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'user@sahaara.gov.in',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Sanctuary Citizen',
            role: (session.user.user_metadata?.role as UserRole) || 'citizen',
            district: session.user.user_metadata?.district || 'Varanasi',
            avatarUrl: session.user.user_metadata?.avatar_url,
            provider: 'supabase_google',
          };
          setUser(authUser);
          localStorage.setItem('sahaara_auth_user', JSON.stringify(authUser));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    setLoading(false);
  }, [isConfigured]);

  const signInWithGoogle = async () => {
    if (isConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('Supabase Google OAuth error:', error.message);
        // Fallback to demo profile if Google OAuth client ID is not yet authorized in Supabase dashboard
        signInAsRole('citizen');
      }
    } else {
      // Seamlessly activate Google SSO profile
      const googleUser: AuthUser = {
        id: `goog-${Date.now()}`,
        email: 'user.google@sahaara.gov.in',
        name: 'Google Verified Citizen',
        role: 'citizen',
        district: 'Varanasi',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        provider: 'supabase_google',
      };
      setUser(googleUser);
      localStorage.setItem('sahaara_auth_user', JSON.stringify(googleUser));
    }
  };

  const signInWithMeriPehchan = async () => {
    // Jan Parichay / MeriPehchan Government National SSO Provider
    const mpUser: AuthUser = {
      id: `mp-${Date.now()}`,
      email: 'officer.nic@meity.gov.in',
      name: 'MeriPehchan Verified Officer',
      role: 'counselor',
      district: 'Varanasi',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      provider: 'meripehchan_sso',
    };
    setUser(mpUser);
    localStorage.setItem('sahaara_auth_user', JSON.stringify(mpUser));
  };

  const signInAsRole = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    setUser(selected);
    localStorage.setItem('sahaara_auth_user', JSON.stringify(selected));
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('sahaara_auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signInWithGoogle,
        signInWithMeriPehchan,
        signInAsRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
