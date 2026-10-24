import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  loginAs: (role: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;
  demoAccounts: { role: UserRole; label: string; email: string; user: User }[];
}

const DEMO_ACCOUNTS: { role: UserRole; label: string; email: string; user: User }[] = [
  {
    role: 'patient',
    label: 'Patient (Alex Johnson)',
    email: 'alex.johnson@example.com',
    user: {
      id: 'usr-pat-1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      role: 'patient',
      patientId: 'pat-1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    },
  },
  {
    role: 'doctor',
    label: 'Doctor (Dr. Sarah Mitchell)',
    email: 'sarah.mitchell@medconnect.demo',
    user: {
      id: 'usr-doc-1',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@medconnect.demo',
      role: 'doctor',
      doctorId: 'doc-1',
      specialty: 'Cardiology',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    },
  },
  {
    role: 'admin',
    label: 'Admin (Medical Board Reviewer)',
    email: 'admin@medconnect.demo',
    user: {
      id: 'usr-adm-1',
      name: 'Admin Reviewer',
      email: 'admin@medconnect.demo',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'medconnect_demo_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user,
          isAuthenticated: !!parsed.user,
          role: parsed.user?.role || 'guest',
        };
      }
    } catch {
      // Fallback
    }
    // Default initial user: Alex Johnson (Patient) for an instantly ready demo!
    const defaultUser = DEMO_ACCOUNTS[0].user;
    return {
      user: defaultUser,
      isAuthenticated: true,
      role: 'patient',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch {
      // Ignore
    }
  }, [authState]);

  const loginAs = (role: UserRole, customUser?: Partial<User>) => {
    if (role === 'guest') {
      setAuthState({
        user: null,
        isAuthenticated: false,
        role: 'guest',
      });
      return;
    }

    const matchedDemo = DEMO_ACCOUNTS.find(a => a.role === role);
    const baseUser = matchedDemo ? matchedDemo.user : {
      id: `usr-${Date.now()}`,
      name: role === 'doctor' ? 'Demo Doctor' : 'Demo User',
      email: `${role}@medconnect.demo`,
      role,
    };

    const finalUser: User = {
      ...baseUser,
      ...customUser,
      role,
    };

    setAuthState({
      user: finalUser,
      isAuthenticated: true,
      role,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      role: 'guest',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginAs,
        logout,
        demoAccounts: DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
