import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserSchema } from '@insforge/shared-schemas';
import { insforge } from '../lib/insforge';

type AuthContextType = {
  user: UserSchema | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserSchema | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    insforge.auth.getCurrentUser()
      .then((res) => {
        // Handle both possible response formats { data: { user } } or { user }
        const currentUser = res?.data?.user || res?.user || null;
        setUser(currentUser);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Auth init error:", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Check and auto-create profile for logged in user
  useEffect(() => {
    if (!user) return;

    const checkAndCreateProfile = async () => {
      try {
        const { data: profile, error } = await insforge.database
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        if (!profile) {
          const { error: insertError } = await insforge.database.from('profiles').insert([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Creator',
            niche: 'tech_ai',
            style_notes: '',
          }]);
          
          if (insertError) {
            console.error('Error auto-creating profile:', insertError);
          }
        }
      } catch (err) {
        console.error('Unexpected error during profile check:', err);
      }
    };

    checkAndCreateProfile();
  }, [user]);

  const signOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

