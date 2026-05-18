import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, username: 'admin', email: 'admin@authshield.io', password: 'admin123', role: 'admin', plan: 'Enterprise', expires: '2027-12-31' },
  { id: 2, username: 'developer', email: 'dev@authshield.io', password: 'dev123', role: 'user', plan: 'Pro', expires: '2026-12-31' },
];

const DEMO_LICENSES = [
  { key: 'ASH-PRO-2026-XXXX-YYYY', type: 'Pro', status: 'active', uses: 5, maxUses: 10, created: '2026-01-15' },
  { key: 'ASH-ENT-2026-AAAA-BBBB', type: 'Enterprise', status: 'active', uses: 12, maxUses: 100, created: '2026-03-01' },
  { key: 'ASH-FREE-2026-CCCC-DDDD', type: 'Free', status: 'expired', uses: 1, maxUses: 1, created: '2025-06-01' },
];

const DEMO_STATS = {
  totalUsers: 1247,
  activeUsers: 892,
  totalLicenses: 3456,
  activeLicenses: 2103,
  apiCalls: 156789,
  uptime: 99.97,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('authshield_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = DEMO_USERS.find(u => (u.username === username || u.email === username) && u.password === password);
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('authshield_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Credenciais inválidas' };
  };

  const register = (username, email, password) => {
    const exists = DEMO_USERS.find(u => u.username === username || u.email === email);
    if (exists) {
      return { success: false, error: 'Utilizador ou email já existe' };
    }
    const newUser = {
      id: DEMO_USERS.length + 1,
      username,
      email,
      role: 'user',
      plan: 'Free',
      expires: '2026-06-30',
    };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('authshield_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authshield_user');
  };

  const getLicenses = () => DEMO_LICENSES;
  const getStats = () => DEMO_STATS;
  const getUsers = () => DEMO_USERS.map(u => ({ ...u, password: undefined }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getLicenses, getStats, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};