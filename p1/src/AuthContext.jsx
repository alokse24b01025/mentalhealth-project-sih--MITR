import React, { useContext, useState } from 'react';
import { API_BASE_URL } from './config';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);

    return data;
  }

  async function register(email, password, otp) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otp })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);

    return data;
  }

  async function loginSendOtp(email) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login-send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to send login OTP');

    return data;
  }

  async function loginVerifyOtp(email, otp) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login-verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'OTP verification failed');

    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loginSendOtp, loginVerifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}