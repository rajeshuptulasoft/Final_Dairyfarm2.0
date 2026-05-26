import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

function getStoredUser() {
  try {
    const saved = localStorage.getItem('user');
    if (!saved || saved === 'undefined' || saved === 'null') {
      return null;
    }
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || token === 'undefined' || token === 'null' || token === 'demo-token') {
      if (token) clearAuthStorage();
      setLoading(false);
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    authAPI
      .me()
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logout]);

  const login = async (email, password) => {
    const res = await authAPI.login({
      email: email.trim().toLowerCase(),
      password,
    });
    const { token, user: loggedInUser } = res.data || {};

    if (!token || !loggedInUser) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    console.log('Login success');
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
