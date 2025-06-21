import { createContext, useState, useEffect } from 'react';
import * as localStorageUtil from '../../utils/localStorage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // Initialize admin credentials in localStorage if not present
  useEffect(() => {
    const adminCreds = localStorageUtil.getItem('adminCredentials');
    if (!adminCreds) {
      const defaultAdmin = { username: 'admin', password: 'admin' };
      localStorageUtil.setItem('adminCredentials', JSON.stringify(defaultAdmin));
    }
  }, []);

  useEffect(() => {
    const token = localStorageUtil.getItem('authToken');
    const storedRole = localStorageUtil.getItem('userRole');
    const storedUsername = localStorageUtil.getItem('username');
    if (token && storedRole && storedUsername) {
      setIsAuthenticated(true);
      setRole(storedRole);
      const users = JSON.parse(localStorageUtil.getItem('users') || '[]');
      const currentUser = users.find(u => u.username === storedUsername);
      if (currentUser) {
        setUser(currentUser);
      } else if (storedRole === 'admin') {
        // For admin, set user from stored admin credentials
        const adminCreds = JSON.parse(localStorageUtil.getItem('adminCredentials'));
        setUser({ username: adminCreds.username, role: 'admin' });
      }
    }
  }, []);

  const login = (username, password) => {
    const adminCreds = JSON.parse(localStorageUtil.getItem('adminCredentials'));
    if (adminCreds && username === adminCreds.username && password === adminCreds.password) {
      localStorageUtil.setItem('authToken', 'dummy-token');
      localStorageUtil.setItem('userRole', 'admin');
      localStorageUtil.setItem('username', username);
      setIsAuthenticated(true);
      setRole('admin');
      setUser({ username, role: 'admin' });
      return true;
    }

    const users = JSON.parse(localStorageUtil.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorageUtil.setItem('authToken', 'dummy-token');
      localStorageUtil.setItem('userRole', 'client');
      localStorageUtil.setItem('username', username);
      setIsAuthenticated(true);
      setRole('client');
      setUser(user);
      return true;
    }

    return false;
  };

  const register = (username, password) => {
    const users = JSON.parse(localStorageUtil.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
      return false;
    }
    const newUser = { username, password, role: 'client', name: '', email: '', phone: '' };
    users.push(newUser);
    localStorageUtil.setItem('users', JSON.stringify(users));
    localStorageUtil.setItem('authToken', 'dummy-token');
    localStorageUtil.setItem('userRole', 'client');
    localStorageUtil.setItem('username', username);
    setIsAuthenticated(true);
    setRole('client');
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorageUtil.removeItem('authToken');
    localStorageUtil.removeItem('userRole');
    localStorageUtil.removeItem('username');
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
