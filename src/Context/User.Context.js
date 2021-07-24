import { useState, createContext, useEffect } from "react";
import { supabase } from "../Utills/SupabaseClient";

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const getUser = async () => {
    const session = await supabase.auth.session();
    setUser(session?.user ?? null);
    const cloneSession = Object.assign({}, session);
    delete cloneSession["user"];
    setSession(session ? cloneSession : null);
  };
  useEffect(() => {
    getUser();
    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setSession(session ? session : null);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const value = {
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
    session,
  };

  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
};

export default UserProvider;
