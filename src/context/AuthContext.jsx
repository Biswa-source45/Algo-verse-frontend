import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:8000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
         await syncUserWithBackend(session.access_token, session.user);
      } else {
         setUser(null);
         localStorage.removeItem('sb-access-token');
         setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
         await syncUserWithBackend(session.access_token, session.user);
      } else {
        setUser(null);
        localStorage.removeItem('sb-access-token');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserWithBackend = async (token, supabaseUser) => {
     try {
         localStorage.setItem('sb-access-token', token);
         
         // Get profile from backend
         const res = await axios.get(`${API_URL}/auth/me`, {
             headers: { Authorization: `Bearer ${token}` }
         });
         
         if (res.data) {
             const profile = res.data;
             
             // Extract name from email (part before @)
             const emailName = profile.email ? profile.email.split('@')[0] : '';
             const displayName = profile.display_name || emailName || profile.username || "User";
             
             // Build full user object
             setUser({
                 id: profile.id,
                 email: profile.email || supabaseUser.email || '',
                 username: profile.username || emailName,
                 name: displayName,
                 avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
                 role: profile.role || 'coder',
                 isAdmin: profile.role === 'admin',
                 bio: profile.bio
             });
             
             console.log('User synced:', {
                 email: profile.email,
                 name: displayName,
                 role: profile.role
             });
         }
     } catch (error) {
         console.error("Backend Sync Error:", error);
         setUser(null);
     } finally {
         setLoading(false);
     }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
             redirectTo: window.location.origin, 
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('sb-access-token');
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
