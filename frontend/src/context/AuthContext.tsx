'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type UserRole = 'victim' | 'counselor' | 'admin' | 'nodal_officer' | 'public';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  district: string;
  caseNumber?: string;
  avatarUrl?: string;
  provider: 'supabase_google' | 'meripehchan_sso' | 'otp_session' | 'demo_sso';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  hasCompletedBaseline: boolean;
  setBaselineCompleted: (completed: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithMeriPehchan: () => Promise<void>;
  signInWithPhoneOtp: (phone: string, otp: string, role?: UserRole) => Promise<boolean>;
  signInAsRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  saveDraftNote: (caseId: string, note: string) => void;
  getDraftNote: (caseId: string) => string;
}

const DEMO_USERS: Record<UserRole, AuthUser> = {
  victim: {
    id: 'usr-v-001',
    email: 'priya.devi@sahay.gov.in',
    name: 'Priya Devi',
    role: 'victim',
    district: 'Varanasi',
    caseNumber: 'NHAA/2026/UP/VNS/00492',
    provider: 'demo_sso',
  },
  counselor: {
    id: 'usr-c-002',
    email: 'dr.ananya.verma@counselor.sahay.gov.in',
    name: 'Dr. Ananya Verma',
    role: 'counselor',
    district: 'Varanasi',
    provider: 'meripehchan_sso',
  },
  admin: {
    id: 'usr-a-003',
    email: 'dm.varanasi@gov.in',
    name: 'District Magistrate, Varanasi',
    role: 'admin',
    district: 'Varanasi',
    provider: 'meripehchan_sso',
  },
  nodal_officer: {
    id: 'usr-no-004',
    email: 'nodal.sp.varanasi@police.gov.in',
    name: 'Superintendent of Police (Nodal)',
    role: 'nodal_officer',
    district: 'Varanasi',
    provider: 'meripehchan_sso',
  },
  public: {
    id: 'usr-p-000',
    email: 'visitor@sahay.gov.in',
    name: 'Visitor',
    role: 'public',
    district: 'National',
    provider: 'demo_sso',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedBaseline, setHasCompletedBaseline] = useState<boolean>(true);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    // 1. Check local cached user state
    const savedUser = localStorage.getItem('sahay_auth_user');
    const savedBaseline = localStorage.getItem('sahay_baseline_completed');
    const savedDrafts = localStorage.getItem('sahay_draft_notes');

    if (savedBaseline !== null) {
      setHasCompletedBaseline(savedBaseline === 'true');
    }

    if (savedDrafts) {
      try { setDraftNotes(JSON.parse(savedDrafts)); } catch (e) {}
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    } else {
      // Default to victim for immediate exploration
      setUser(DEMO_USERS.victim);
      localStorage.setItem('sahay_auth_user', JSON.stringify(DEMO_USERS.victim));
    }

    // 2. Check Supabase active session
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'user@sahay.gov.in',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen',
            role: (session.user.user_metadata?.role as UserRole) || 'victim',
            district: session.user.user_metadata?.district || 'Varanasi',
            provider: 'supabase_google',
          };
          setUser(authUser);
          localStorage.setItem('sahay_auth_user', JSON.stringify(authUser));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'user@sahay.gov.in',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen',
            role: (session.user.user_metadata?.role as UserRole) || 'victim',
            district: session.user.user_metadata?.district || 'Varanasi',
            provider: 'supabase_google',
          };
          setUser(authUser);
          localStorage.setItem('sahay_auth_user', JSON.stringify(authUser));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    setLoading(false);
  }, [isConfigured]);

  const setBaselineCompleted = (completed: boolean) => {
    setHasCompletedBaseline(completed);
    localStorage.setItem('sahay_baseline_completed', completed ? 'true' : 'false');
  };

  const signInWithGoogle = async () => {
    if (isConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        signInAsRole('victim');
      }
    } else {
      signInAsRole('victim');
    }
  };

  const signInWithMeriPehchan = async () => {
    const mpUser: AuthUser = {
      id: `mp-${Date.now()}`,
      email: 'nodal.officer@nic.in',
      name: 'Dr. Ananya Verma',
      role: 'counselor',
      district: 'Varanasi',
      provider: 'meripehchan_sso',
    };
    setUser(mpUser);
    localStorage.setItem('sahay_auth_user', JSON.stringify(mpUser));
  };

  const signInWithPhoneOtp = async (_phone: string, otp: string, role: UserRole = 'victim'): Promise<boolean> => {
    if (otp === '123456' || otp.length === 6) {
      const loggedUser = DEMO_USERS[role] || DEMO_USERS.victim;
      setUser(loggedUser);
      localStorage.setItem('sahay_auth_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const signInAsRole = (role: UserRole) => {
    const selected = DEMO_USERS[role] || DEMO_USERS.victim;
    setUser(selected);
    localStorage.setItem('sahay_auth_user', JSON.stringify(selected));
  };

  const signOut = async () => {
    if (isConfigured) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    localStorage.removeItem('sahay_auth_user');
    setUser(null);
  };

  const saveDraftNote = (caseId: string, note: string) => {
    const updated = { ...draftNotes, [caseId]: note };
    setDraftNotes(updated);
    localStorage.setItem('sahay_draft_notes', JSON.stringify(updated));
  };

  const getDraftNote = (caseId: string): string => {
    return draftNotes[caseId] || '';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        hasCompletedBaseline,
        setBaselineCompleted,
        signInWithGoogle,
        signInWithMeriPehchan,
        signInWithPhoneOtp,
        signInAsRole,
        signOut,
        saveDraftNote,
        getDraftNote,
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
