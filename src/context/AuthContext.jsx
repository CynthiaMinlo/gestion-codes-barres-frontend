import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('utilisateur');
    const t = localStorage.getItem('token');
    if (u && t) setUtilisateur(JSON.parse(u));
    setLoading(false);
  }, []);

  const login = async (loginVal, motDePasse) => {
    const { data } = await api.post('/auth/login', { login: loginVal, mot_de_passe: motDePasse });
    const { token, utilisateur: user } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(user));
    setUtilisateur(user);
    return user;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.clear();
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
