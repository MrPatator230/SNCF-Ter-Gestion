import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('username');
    if (token && storedRole && storedUsername) {
      setIsAuthenticated(true);
      setRole(storedRole);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.username === storedUsername);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, []);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('authToken', 'dummy-token');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      setRole('admin');
      setUser({ username, role: 'admin' });
      return true;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('authToken', 'dummy-token');
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      setRole('client');
      setUser(user);
      return true;
    }

    return false;
  };

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
      return false;
    }
    const newUser = { username, password, role: 'client', name: '', email: '', phone: '' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('authToken', 'dummy-token');
    localStorage.setItem('userRole', 'client');
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setRole('client');
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
