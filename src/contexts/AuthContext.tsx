// ============================================================================
// ENHANCED AUTHENTICATION CONTEXT
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (!error) {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.',
      });

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign up failed',
        description: authError.message,
        variant: 'destructive',
      });
      return { user: null, error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign in failed',
        description: authError.message,
        variant: 'destructive',
      });
      return { user: null, error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Signed out successfully',
        description: 'Come back soon!',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign out failed',
        description: authError.message,
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for further instructions.',
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Password reset failed',
        description: authError.message,
        variant: 'destructive',
      });
      return { error: authError };
    }
  };

  const updateProfile = async (data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
