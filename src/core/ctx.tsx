import { useContext, createContext, type PropsWithChildren, useMemo } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: (user: { id: number; login: string; nome: string }) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const contextValue = useMemo(() => ({
    signIn: (user: { id: number; login: string; nome: string }) => {
      const formattedToJson = JSON.stringify(user);
      setSession(formattedToJson);
    },
    signOut: () => {
      setSession(null);
    },
    session,
    isLoading,
  }), [session, isLoading, setSession]);

  return (
    <AuthContext.Provider
      value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
